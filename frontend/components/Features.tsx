import { Card } from "@/components/ui/card";
import { Video, MessageSquare, Share2, Lock, Calendar, Monitor, Users, Mic } from "lucide-react";

const features = [
    {
        icon: Video,
        title: "HD Video & Audio",
        description: "Experience crystal-clear video calls with advanced audio processing and HD quality streaming.",
    },
    {
        icon: MessageSquare,
        title: "Real-time Chat",
        description: "Instant messaging during calls with file sharing, emoji reactions, and threaded conversations.",
    },
    {
        icon: Share2,
        title: "Screen Sharing",
        description: "Share your entire screen or specific applications with seamless quality and low latency.",
    },
    {
        icon: Lock,
        title: "Secure & Private",
        description: "End-to-end encryption ensures your conversations stay private and secure at all times.",
    },
    {
        icon: Calendar,
        title: "Easy Scheduling",
        description: "Integrate with your calendar and schedule meetings with one click. Send instant invites.",
    },
    {
        icon: Monitor,
        title: "Recording",
        description: "Record meetings with cloud storage. Automatic transcripts and searchable content.",
    },
    {
        icon: Users,
        title: "Large Meetings",
        description: "Host meetings with up to 100+ participants with breakout rooms and waiting rooms.",
    },
    {
        icon: Mic,
        title: "Noise Cancellation",
        description: "AI-powered noise suppression removes background noise for professional audio quality.",
    },
];

const Features = () => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Powerful features designed to make your video meetings more productive and engaging.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="p-6 hover:shadow-soft transition-all duration-300 hover:-translate-y-1 border-border bg-secondary hover:border-primary/50"
                            >
                                <div className="flex items-center">
                                    <div className="inline-flex p-3 rounded-lg bg-primary/10 w-fit mr-5">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-card-foreground">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;