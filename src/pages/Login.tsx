
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // For now, redirect to register regardless of input
    navigate('/register');
  };

  const handleSignUp = () => {
    // Redirect to register flow
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="container mx-auto max-w-md">
        <Card className="p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Co-create Network</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Zapfloor Login Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Already have a Zapfloor login?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Co-create is powered by Zapfloor, login below with your existing credentials
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">User name</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your user name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleLogin} 
                  className="w-full"
                  size="lg"
                >
                  Login with Zapfloor
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-sm text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            
            {/* Sign Up Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">New to Co-create Network?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your company account and join our global coworking network.
              </p>
              
              <Button 
                onClick={handleSignUp} 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                Sign Up for New Account
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
