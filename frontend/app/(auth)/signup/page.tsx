"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";



const SignUp = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {

        setIsLoading(true)

        if (!name || !email || !password || !confirmPassword) {
            return console.log("All fields are required");
        }

        if (password !== confirmPassword) {
            return console.log("Passwords do not match");
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/signup`, {
                name,
                email,
                password,
            });

            console.log("SignUp Successful", response.data);

            router.push("/signin")
        } catch (error: any) {
            console.error("SignUp Failed:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '6s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <Card className="w-full max-w-md bg-card border-border">
                <CardHeader className="space-y-1 flex flex-col  items-center">
                    <CardTitle className="text-2xl font-bold text-foreground">Create Account</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your information to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Full Name</Label>
                        <Input id="name" type="text" placeholder="John Doe" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground">Password</Label>
                        <Input id="password" type="password" placeholder="Password" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-foreground">Confirm Password</Label>
                        <Input id="confirm-password" type="password" placeholder="*********" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">Passwords Do Not Match</p>
                        )}
                    </div>
                    <Button variant="ghost" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer" size="lg" onClick={handleSignUp} disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Signing Up...</span>
                            </div>
                        ) : (
                            "Sign Up"
                        )}

                    
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground hidden">Or continue with</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary cursor-pointer" hidden>
                        <Image src={"/google.svg"} width={15} height={15} alt="Google" />
                        Google
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/signin" className="text-primary hover:underline font-semibold">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div >
    );
};

export default SignUp;
