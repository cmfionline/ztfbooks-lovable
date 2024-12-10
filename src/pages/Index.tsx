import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  BookOpen,
  Award,
} from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center mb-8 gap-6">
        <Avatar className="w-32 h-32">
          <img
            src="https://github.com/shadcn.png"
            alt="Profile"
            className="rounded-full"
          />
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-primary">John Doe</h1>
          <h2 className="text-xl text-muted-foreground mt-2">
            Senior Software Engineer
          </h2>
          <div className="flex flex-col md:flex-row gap-4 mt-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>john.doe@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-semibold">Experience</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Senior Software Engineer</h3>
              <p className="text-muted-foreground">Tech Corp • 2020 - Present</p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground">
                <li>Led development of cloud-native applications</li>
                <li>Managed team of 5 developers</li>
                <li>Improved system performance by 40%</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Software Engineer</h3>
              <p className="text-muted-foreground">StartUp Inc • 2018 - 2020</p>
              <ul className="list-disc list-inside mt-2 text-muted-foreground">
                <li>Developed full-stack web applications</li>
                <li>Implemented CI/CD pipelines</li>
                <li>Reduced deployment time by 60%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-semibold">Education</h2>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Master of Science in Computer Science
            </h3>
            <p className="text-muted-foreground">
              Stanford University • 2016 - 2018
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">Technical Skills</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div>• JavaScript/TypeScript</div>
              <div>• React/Next.js</div>
              <div>• Node.js</div>
              <div>• Python</div>
              <div>• AWS</div>
              <div>• Docker</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">Certifications</h2>
            </div>
            <div className="space-y-2 text-muted-foreground">
              <div>• AWS Certified Solutions Architect</div>
              <div>• Google Cloud Professional Developer</div>
              <div>• Microsoft Azure Expert</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;