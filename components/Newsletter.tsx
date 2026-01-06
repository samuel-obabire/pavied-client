import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Newsletter = () => {
  return (
    <div className="relative z-10 -mb-[120px] px-4">
      <div className="mx-auto max-w-[1100px] rounded-[32px] border border-black-1/5 bg-white p-8 text-center shadow-xl dark:border-white/5 dark:bg-black-2 md:p-16">
        <h2 className="text-[32px] font-bold leading-tight text-black-1 dark:text-white md:text-[56px]">
          Subscribe to Our Newsletter
        </h2>
        <p className="mt-4 text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium">
          Subscribe to our newsletter to get updates on new features.
        </p>
        
        <form 
          className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row"
        >
          <div className="w-full max-w-[450px]">
            <Input 
              type="email" 
              placeholder="Input Email address" 
              className="h-14 rounded-xl border-black-1/5 bg-[#F5F6F8] px-6 text-16-regular dark:bg-white/5"
            />
          </div>
          <Button className="btn-secondary h-14 w-full rounded-xl px-10 text-16-bold md:w-auto">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
