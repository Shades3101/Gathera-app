import { Button } from "@/components/ui/button";
import { Video, Users, Shield } from "lucide-react";
import Link from "next/link";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '6s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border text-foreground text-sm font-medium animate-fade-in">
                        <Video className="w-4 h-4 text-primary" />
                        <span>Professional video conferencing made simple</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in"
                        style={{ animationDelay: '0.1s' }}>
                        Connect Teams
                        <br />
                        <span className="text-primary">
                            Anywhere, Anytime
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in"
                        style={{ animationDelay: '0.2s' }}>
                        High-quality video meetings with crystal-clear audio. Collaborate seamlessly with your team from anywhere in the world.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
                        style={{ animationDelay: '0.3s' }}>
                        <Button variant="hero" size="lg" className="w-full sm:w-auto hover:bg-blue-600 cursor-pointer">
                            <Link href={"/me"}>
                                Start Meeting Now
                            </Link>
                        </Button>
                
                    </div>

                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-in"
                        style={{ animationDelay: '0.4s' }}>
                        <div className="flex flex-col items-center p-6 rounded-xl bg-secondary border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                            <Video className="w-8 h-8 mb-3 text-primary" />
                            <p className="text-3xl font-bold mb-1 text-foreground">HD Quality</p>
                            <p className="text-muted-foreground text-sm">Crystal clear video</p>
                        </div>
                        <div className="flex flex-col items-center p-6 rounded-xl bg-secondary border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                            <Users className="w-8 h-8 mb-3 text-primary" />
                            <p className="text-3xl font-bold mb-1 text-foreground">100+ Users</p>
                            <p className="text-muted-foreground text-sm">Large meetings support</p>
                        </div>
                        <div className="flex flex-col items-center p-6 rounded-xl bg-secondary border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                            <Shield className="w-8 h-8 mb-3 text-primary" />
                            <p className="text-3xl font-bold mb-1 text-foreground">Secure</p>
                            <p className="text-muted-foreground text-sm">End-to-end encryption</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
        </section>
    );
};

export default Hero;