import { redirect } from "next/navigation";

/** Local registration is disabled; company SSO is enforced via middleware. */
export default function RegisterPage() {
  redirect("/");
}
