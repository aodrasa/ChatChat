'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { User } from '@prisma/client';

import { toast } from 'react-hot-toast';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { siteConfig } from '@/config/site.config';
import { signOut } from 'next-auth/react';

const ProfileInfoForm = ({ user }: any) => {
    const router = useRouter();

    const [name, setName] = useState<string>(user.name);
    const [email, setEmail] = useState<string>(user.email);
    const [image, setImage] = useState<string>(user.image);

    const [isLoading, setIsLoading] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onSave = async () => {
        setIsLoading(true);

        const response = await fetch(`/api/user/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                image: image,
            }),
        });

        if (!response?.ok) {
            setIsLoading(false);
            toast.error('Something went wrong.');
            return;
        }

        setIsLoading(false);
        toast.success('Profile updated.');
    };

    const onDelete = async () => {
        const response = await fetch(`/api/user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response?.ok) {
            toast.error('Something went wrong.');
            return;
        }

        toast.success('Account deleted.');

        await signOut();

        router.push('/');
    };

    return (
        <div className='space-y-10 overflow-auto md:my-36 md:w-6/12 md:space-y-16'>
            <form className='space-y-10 rounded-xl md:p-3'>
                <div className='flex w-full justify-between space-x-3'>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>Full Name</p>
                        <Input value={name as string} onChange={(e) => setName(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                    </div>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>Email Address</p>
                        <Input value={email as string} onChange={(e) => setEmail(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                    </div>
                </div>
                <div className='flex w-full flex-col items-start space-y-1'>
                    <p className='text-sm'>Avatar</p>
                    <Input value={image as string} onChange={(e) => setImage(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                </div>
                <div className='flex justify-end'>
                    <Button variant='default' onClick={() => onSave()} disabled={isLoading}>
                        {isLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </form>

            <Separator />

            <div className='space-y-3'>
                <p className='text-lg font-medium'>Danger Zoom</p>
                <p className='text-sm text-gray-400'>If you want to permanently remove your account from {siteConfig.title}. Please click the button below, please note, This could not be undone.</p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <button className='text-sm text-red-500'>Delete Account</button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirming Deletion</DialogTitle>
                            <DialogDescription>Please note: This could not be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant='destructive' onClick={onDelete}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ProfileInfoForm;
