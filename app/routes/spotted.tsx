import { useOptionalUser } from "~/utils";

export default function SpotForm() {
  //can only be accessed if logged in.

  const user = useOptionalUser();
  return (
    <div>
      <h1>Hi, Welcome to the Spotter Form</h1>
      <p>Please fill out these details.</p>
    </div>
  );
}
