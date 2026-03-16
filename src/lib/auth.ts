import { getServerSession as getSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export const getServerSession = () => getSession(authOptions);
