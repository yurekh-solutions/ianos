import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import User from '@/models/User';
import Customer from '@/models/Customer';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user?.companyId) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const invoices = await Invoice.find({ companyId: user.companyId })
      .sort({ createdAt: -1 });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user?.companyId) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const body = await req.json();
    
    // Get customer details
    const customer = await Customer.findById(body.customerId);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Calculate invoice items with totals
    const items = await Promise.all(
      body.items.map(async (item: { productId: string; quantity: number }) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        
        const taxAmount = (product.price * item.quantity * product.taxRate) / 100;
        const total = product.price * item.quantity + taxAmount;
        
        return {
          productId: product._id.toString(),
          productName: product.name,
          description: product.description,
          quantity: item.quantity,
          price: product.price,
          taxRate: product.taxRate,
          taxAmount,
          total,
        };
      })
    );

    const subtotal = items.reduce((sum: number, item: { total: number; taxAmount: number }) => 
      sum + item.total - item.taxAmount, 0);
    const taxTotal = items.reduce((sum: number, item: { taxAmount: number }) => sum + item.taxAmount, 0);
    const totalAmount = subtotal + taxTotal;

    // Generate invoice number
    const invoiceCount = await Invoice.countDocuments({ companyId: user.companyId });
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}-${(invoiceCount + 1).toString().padStart(4, '0')}`;

    const invoice = await Invoice.create({
      companyId: user.companyId,
      customerId: customer._id.toString(),
      customerName: customer.name,
      customerEmail: customer.email,
      customerAddress: customer.address,
      customerGstNumber: customer.gstNumber,
      invoiceNumber,
      invoiceDate: new Date(body.invoiceDate),
      dueDate: new Date(body.dueDate),
      items,
      subtotal,
      taxTotal,
      totalAmount,
      status: 'draft',
      notes: body.notes,
      terms: body.terms,
      createdBy: user._id.toString(),
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
