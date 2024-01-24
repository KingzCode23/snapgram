import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SigninValidation } from "@/lib/Validation"
import Loader from "@/components/ui/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import {  useSignInAccount } from "@/lib/react-query/queryAndMutation"
import { useUserContext } from "@/context/AuthContext"

// const formSchema = z.object({
//   username: z.string().min(2).max(50),
// })

const SigninForm = () => {
  const {toast} = useToast();
  const navigate = useNavigate();


  const {mutateAsync: signInAccount} = useSignInAccount();
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();


   // 1. Define your form.
   const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: ""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {

     const session = await signInAccount({
      email: values.email,
      password: values.password,
     })

     if(!session){
      return toast({title: 'Sign in failed. please try again.'});
     }

     const isLoggedIn = await checkAuthUser();

     if(isLoggedIn){
      form.reset();

      navigate('/')
     }else {
      return toast({title: 'Sign up failed. please try again.'});
     }
  }


  return (
      <Form {...form}>

        <div className="flex-center flex-col sm:w-420">
          <img src="/assets/images/logo.svg"/>
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
            Welcome back! Please enter your details
          </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" className="shad-input" {...field} />
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
                      <Input type="password" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="shad-button_primary">
                {isUserLoading ? (
                  <div className="flex-center gap-2">
                    <Loader />Loading...
                  </div>
                ): "Sign-In"}
              </Button>

              <p className="text-small-regular text-light-2 text-center mt-2">
                Don't have an Account?
                <Link to='/sign-up' className="text-primary-500 text-small-semibold ml-1">Sign-Up</Link>
              </p>
            </form>
        </div>
      </Form>
  )
}

export default SigninForm