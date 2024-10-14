import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

// components
import { Button } from "@/app/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/form";
import { Input } from "@/app/components/input";

// api
import { useSignInHandler } from "../api/useSignInHandler";

// hooks
import { useForm } from "../lib/useForm";

// services
import SessionService from "@/core/services/session.service";

export const SignInForm = () => {
  const { navigate } = useRouter();
  const { signIn, isPending } = useSignInHandler({
    onSuccess: (response) => {
      const sessionService = new SessionService();
      sessionService.createNew({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      toast.success("Successfully signed in!");
      navigate({
        to: "/"
      })
    },
    onError: (response) => {
      toast.error(response.message);
    },
  });
  const { form, handleSubmit } = useForm({
    handler: signIn,
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={isPending} className="w-full" type="submit">
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
