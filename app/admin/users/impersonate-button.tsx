'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { impersonateUser } from '@/app/admin/actions'
import { LogIn, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ImpersonateButtonProps {
    userId: string
    userName: string
}

export function ImpersonateButton({ userId, userName }: ImpersonateButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleImpersonate = async () => {
        try {
            setIsLoading(true)
            const result = await impersonateUser(userId)

            if (result.success && result.url) {
                toast.success(`Impersonating ${userName}...`, {
                    description: "You will be redirected shortly."
                })
                // Use window.location to strictly follow the magic link redirect
                window.location.href = result.url
            } else {
                toast.error('Failed to start impersonation', {
                    description: result.error || 'Unknown error occurred'
                })
            }
        } catch (error) {
            toast.error('An error occurred', {
                description: 'Please try again later'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleImpersonate}
            disabled={isLoading}
            className="flex items-center gap-2"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <LogIn className="h-4 w-4" />
            )}
            Impersonate
        </Button>
    )
}
