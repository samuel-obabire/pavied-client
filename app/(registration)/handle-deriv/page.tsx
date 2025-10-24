import { Loader } from "lucide-react";
import { Suspense } from "react";

import HandleDerivConn from "@/components/HandleDerivConn";

const HandleDerivRedirectPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex-center mt-8 flex">
          <Loader className="animate-spin" />
        </div>
      }
    >
      <HandleDerivConn />
    </Suspense>
  );
};

export default HandleDerivRedirectPage;
