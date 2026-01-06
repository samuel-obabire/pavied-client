import Image from "next/image";

const depositSteps = [
  {
    step: 1,
    title: "Sign up and Set up Account",
    description: "Create an account on Pavied, Log in to your account if you have an account already.",
    image: "/assets/home/deposit-1.webp",
    large: true,
  },
  {
    step: 2,
    title: "Verify Account",
    description: "Make sure to verify your account, Unverified accounts will not be permitted to make transactions.",
    image: "/assets/home/deposit-2.webp",
    large: true,
  },
  {
    step: 3,
    title: "Sync Your Deriv Account",
    description: "Sync your Deriv account with your Pavied account.",
    image: "/assets/home/deposit-3.webp",
    large: false,
  },
  {
    step: 4,
    title: "Choose Deposit Amount",
    description: "Fund your Deriv account with as little as $1 or as much as you need.",
    image: "/assets/home/deposit-4.webp",
    large: false,
  },
  {
    step: 5,
    title: "Instant Processing",
    description: "Complete payment, and your Deriv account will be credited immediately.",
    image: "/assets/home/deposit-5.webp",
    large: false,
  },
];

const withdrawalSteps = [
  {
    step: 1,
    title: "Sign up and Set up Account",
    description: "Create an account on Pavied, Log in to your account if you have an account already.",
    image: "/assets/home/withdrawal-1.webp",
    large: true,
  },
  {
    step: 2,
    title: "Verify Account",
    description: "Make sure to verify your account, Unverified accounts will not be permitted to make transactions.",
    image: "/assets/home/withdrawal-2.webp",
    large: true,
  },
  {
    step: 3,
    title: "Sync Your Deriv Account",
    description: "After syncing your Deriv account, go to withdrawal section on our platform",
    image: "/assets/home/deposit-3.webp",
    large: false,
  },
  {
    step: 4,
    title: "Enter Withdrawal Amount",
    description: "Withdraw any amount, big or small.",
    image: "/assets/home/withdrawal-4.webp",
    large: false,
  },
  {
    step: 5,
    title: "Automatic Payment",
    description: "Receive funds instantly to your preferred payment method.",
    image: "/assets/home/deposit-5.webp",
    large: false,
  },
];

const StepCard = ({ step, title, description, image, large }: { step: number; title: string; description: string; image: string; large: boolean }) => (
  <div className={`flex flex-col gap-4 rounded-2xl bg-[#F5F6F8] p-4 dark:bg-black-1/40 ${large ? "lg:col-span-3" : "lg:col-span-2"}`}>
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-white dark:bg-black-2/60">
      <Image
        src={image}
        alt={title}
        fill
        className="object-contain p-4"
      />
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-sm bg-secondary text-white text-12-bold">
          {step}
        </div>
        <h4 className="text-16-bold text-black-1 dark:text-white">
          {title}
        </h4>
      </div>
      <p className="text-14-medium text-black-1/60 dark:text-white/60 leading-tight">
        {description}
      </p>
    </div>
  </div>
);

const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <span className="text-secondary bg-secondary/10 px-3 py-1 rounded-full text-12-medium">How It Works</span>
          <h2 className="mt-4 font-semibold text-2xl text-primary dark:text-white">Deposition Process</h2>
          <p className="mt-2 text-16-medium text-black-1/60 dark:text-white/60">Here is a quick guide on how to make deposition via on our platform</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          {depositSteps.map((s) => (
            <StepCard key={`dep-${s.step}`} {...s} />
          ))}
        </div>

        <div className="mt-20 mb-12">
          <h2 className="font-semibold text-2xl text-primary dark:text-white">Withdrawal Process</h2>
          <p className="mt-2 text-16-medium text-black-1/60 dark:text-white/60">Here is a quick guide on how to make Withdrawal via on our platform</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          {withdrawalSteps.map((s) => (
            <StepCard key={`with-${s.step}`} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
