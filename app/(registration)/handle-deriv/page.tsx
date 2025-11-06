import { Suspense } from "react";
import { Loader } from "lucide-react";
import HandleDerivConn from "@/components/HandleDerivConn";

const HandleDerivRedirectPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex-center mt-16 flex">
          <Loader className="animate-spin" />
        </div>
      }
    >
      <HandleDerivConn />
    </Suspense>
  );
};

export default HandleDerivRedirectPage;
