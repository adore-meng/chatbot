import { redirect } from "next/navigation";

/** Local login is disabled; company SSO is enforced via middleware. */
export default function LoginPage() {
  redirect("/");
}
