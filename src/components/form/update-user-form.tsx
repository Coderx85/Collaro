import { UpdateUserSchema } from "@/db/schema/type";
import { IUserDTO } from "@/types";
import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { IconAt, IconChecks, IconLoader2, IconMail, IconSettings2, IconUser } from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserAction } from "@/action";
import { useState } from "react";

const userUpdateSchema = UpdateUserSchema.pick({
  name: true,
  userName: true,
  email: true,
}).required({
  name: true,
  userName: true,
  email: true,
})

type UserFormParams = {
  user: IUserDTO
}

export function UpdateUserForm({user}: UserFormParams) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const userForm = useForm({
    defaultValues: {
      name: user.name,
      userName: user.userName,
      email: user.email,
    },
    validators: {
      onSubmit: userUpdateSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSaving(true);
      
      const result = await updateUserAction({
        name: value.name,
        userName: value.userName,
        email: value.email,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to update profile.");
        setIsSaving(false);
        return;
      }

      toast.success("Profile updated successfully.");
      router.refresh();
    }
  })

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <IconSettings2 className="size-5" />
            User Settings.
          </CardTitle>
          <CardDescription>
            Edit your account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              userForm.handleSubmit();
            }}
            className="md:col-span-2 space-y-6"
          >
            <FieldGroup>
              <userForm.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        Full name
                      </FieldLabel>
                      <FieldContent>
                        <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(event) => field.setValue(event.target.value)}
                          placeholder="Your name"
                          onBlur={field.handleBlur}
                          autoComplete={"name"}
                          className="pl-10"
                        />
                      </FieldContent>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </userForm.Field>

              <userForm.Field name="userName">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        Username
                      </FieldLabel>
                      <FieldContent>
                        <IconAt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(event) => field.setValue(event.target.value)}
                          placeholder="Your username"
                          onBlur={field.handleBlur}
                          autoComplete={"username"}
                          className="pl-10"
                        />
                      </FieldContent>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </userForm.Field>

              <userForm.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-sm font-medium"
                      >
                        Email address
                      </FieldLabel>
                      <FieldContent>
                        <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground dark:text-foreground" />
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onChange={(event) => field.setValue(event.target.value)}
                          placeholder="your@email.com"
                          onBlur={field.handleBlur}
                          autoComplete={"email"}
                          className="pl-10"
                        />
                      </FieldContent>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </userForm.Field>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full px-8"
                >
                  {isSaving ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <IconChecks className="size-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>

              </FieldGroup> 
          </form>
        </CardContent>
      </Card>
    </div>
  )
}