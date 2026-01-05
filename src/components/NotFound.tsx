import { JSX } from "react";
import { Navigate } from "react-router-dom";

function NotFound(): JSX.Element {

  return <Navigate to="/" />
}

export default NotFound;