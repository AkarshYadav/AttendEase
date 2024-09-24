import { UserButton } from "@clerk/nextjs"
import { currentUser } from '@clerk/nextjs/server';

import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react";

import Link from "next/link";

export const Actions = async () => {
    const user = await currentUser();
    return (
        <div className="flex items-center gap-x-2 ml-2 lg:ml-0 justify-end">
            {!!user && (
                <div className="flex items-center">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-primary">
                        <Link href={`/u/${user.username}`}>
                            <div className="flex items-center justify-between gap-2">
                                <CirclePlus
                                    className="h-6 w-6 ">
                                </CirclePlus>
                                <p className="hidden lg:block  ">
                                    Join Class
                                </p>
                            </div>
                        </Link>
                    </Button>
                    <UserButton >

                    </UserButton>
                </div>
            )}


        </div>
    )
}