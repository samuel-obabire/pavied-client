import Image from "next/image";

type ProcessStep = {
  step: number;
  title: string;
  description: string;
  image: string;
};

type StepCardProps = ProcessStep;

// Settlement & payment infrastructure adaptation while preserving step card logic.
const depositSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Onboard & Verify",
    description: "Create an account and complete secure onboarding.",
    image: "/assets/home/deposit-1.webp",
  },
  {
    step: 2,
    title: "Deposit or Request Payout",
    description:
      "Users initiate funding or withdrawal through structured settlement channels.",
    image: "/assets/home/deposit-3.webp",
  },
  {
    step: 3,
    title: "Automated Routing & Confirmation",
    description:
      "Transactions are processed through secure rails with real-time tracking.",
    image: "/assets/home/deposit-4.webp",
  },
  {
    step: 4,
    title: "Settlement & Reconciliation",
    description:
      "Full ledger records and transaction logs are available instantly.",
    image: "/assets/home/deposit-5.webp",
  },
];

const withdrawalSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Onboard & Verify",
    description: "Create an account and complete secure onboarding.",
    image: "/assets/home/withdrawal-1.webp",
  },
  {
    step: 2,
    title: "Submit Payout Instruction",
    description:
      "Initiate a payout request through the platform with structured controls.",
    image: "/assets/home/deposit-3.webp",
  },
  {
    step: 3,
    title: "Automated Risk & Routing Checks",
    description:
      "Transactions are validated and routed with monitoring in real time.",
    image: "/assets/home/withdrawal-4.webp",
  },
  {
    step: 4,
    title: "Settlement Completion",
    description:
      "Payout confirmation and reconciliation records are completed instantly.",
    image: "/assets/home/deposit-5.webp",
  },
];

const StepCard = ({ step, title, description, image }: StepCardProps) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-black-1/5 bg-[#F5F6F8] p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/5 dark:bg-black-1/40">
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-black-1/5 bg-white dark:border-white/10 dark:bg-black-2/60">
      <Image src={image} alt={title} fill className="object-contain p-4" />
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-sm bg-secondary text-white text-12-bold">
          {step}
        </div>
        <h4 className="text-16-bold text-black-1 dark:text-white">{title}</h4>
      </div>
      <p className="text-14-medium text-black-1/60 dark:text-white/60 leading-tight">
        {description}
      </p>
    </div>
  </div>
);

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <span className="text-secondary bg-secondary/10 px-3 py-1 rounded-full text-12-medium">
            How It Works
          </span>
          <h2 className="mt-4 font-semibold text-2xl text-primary dark:text-white">
            How Pavied Works
          </h2>
          <p className="mt-2 text-16-medium text-black-1/60 dark:text-white/60">
            A neutral, secure flow for deposit and payout operations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {depositSteps.map((s) => (
            <StepCard key={`dep-${s.step}`} {...s} />
          ))}
        </div>

        <div className="mt-20 mb-12">
          <h2 className="font-semibold text-2xl text-primary dark:text-white">
            Payout Flow
          </h2>
          <p className="mt-2 text-16-medium text-black-1/60 dark:text-white/60">
            Built for fast turnaround, visibility, and reconciliation at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {withdrawalSteps.map((s) => (
            <StepCard key={`with-${s.step}`} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
