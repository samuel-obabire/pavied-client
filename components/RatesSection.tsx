import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchCachedRate } from "@/lib/actions/rate.action";
import { ROUTES } from "@/lib/constants/routes";
import { formatNairaAmount } from "@/lib/utils";
import BrandName from "./BrandName";
import { Button } from "./ui/button";

type FloatingIcon = {
  name: string;
  src: string;
  alt: string;
  wrapperClassName: string;
  containerClassName: string;
  transform: string;
};

// Settlement & payment infrastructure adaptation while preserving floating icon behavior and rates logic.
const floatingIcons: FloatingIcon[] = [
  {
    name: "USD",
    src: "/assets/usd-currency.svg",
    alt: "USD",
    wrapperClassName:
      "size-12 md:size-16 rounded-full bg-white border border-black-1/10 p-2 shadow-lg animate-[spin_30s_linear_infinite_reverse]",
    containerClassName: "absolute flex items-center justify-center",
    transform: "rotate(0deg) translateY(-160px) rotate(0deg)",
  },
  {
    name: "Platform",
    src: "/assets/home/deriv-icon.png",
    alt: "Trading platform",
    wrapperClassName:
      "size-12 md:size-16 rounded-full bg-[#FF4449] p-2 shadow-lg animate-[spin_30s_linear_infinite_reverse] flex items-center justify-center",
    containerClassName:
      "absolute flex items-center justify-center md:translate-x-0",
    transform: "rotate(60deg) translateY(-160px) rotate(-60deg)",
  },
  {
    name: "Bitcoin",
    src: "/assets/home/bitcoin-icon.png",
    alt: "Bitcoin",
    wrapperClassName:
      "size-12 md:size-16 rounded-full bg-[#F7931A] p-2 shadow-lg animate-[spin_30s_linear_infinite_reverse]",
    containerClassName: "absolute flex items-center justify-center",
    transform: "rotate(120deg) translateY(-160px) rotate(-120deg)",
  },
  {
    name: "USDC",
    src: "/assets/usdc-currency.svg",
    alt: "USDC",
    wrapperClassName:
      "size-12 md:size-16 rounded-full p-0 shadow-lg animate-[spin_30s_linear_infinite_reverse]",
    containerClassName: "absolute flex items-center justify-center",
    transform: "rotate(180deg) translateY(-160px) rotate(-180deg)",
  },
  {
    name: "USDT",
    src: "/assets/usdt-currency.svg",
    alt: "USDT",
    wrapperClassName:
      "size-12 md:size-16 rounded-full bg-[#26A17B] p-2 shadow-lg animate-[spin_30s_linear_infinite_reverse]",
    containerClassName: "absolute flex items-center justify-center",
    transform: "rotate(240deg) translateY(-160px) rotate(-240deg)",
  },
  {
    name: "Solana",
    src: "/assets/home/solana-icon.png",
    alt: "Solana",
    wrapperClassName:
      "size-12 md:size-16 rounded-full bg-black p-2 shadow-lg animate-[spin_30s_linear_infinite_reverse] flex items-center justify-center",
    containerClassName: "absolute flex items-center justify-center",
    transform: "rotate(300deg) translateY(-160px) rotate(-300deg)",
  },
];

const RatesSection = async () => {
  const getUsdRate = fetchCachedRate("USD");
  const { data: usdRate } = await getUsdRate();

  const depositRateDisplay = usdRate?.depositRate
    ? `${formatNairaAmount(usdRate.depositRate)}/$`
    : "Best Market Rates";
  const withdrawalRateDisplay = usdRate?.withdrawalRate
    ? `${formatNairaAmount(usdRate.withdrawalRate)}/$`
    : "Best Market Rates";

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-[#F5F6F8] dark:bg-black-1/40 border border-black-1/5 dark:border-white/5 p-8 md:p-16 lg:p-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Content */}
            <div className="flex flex-col items-start lg:max-w-[500px] z-10">
              <div className="mb-6 inline-flex items-center rounded-full bg-secondary/10 px-4 py-1 text-secondary">
                <span className="text-12-medium md:text-14-medium">
                  Security & Compliance
                </span>
              </div>

              <h2 className="text-[36px] font-bold leading-[44px] text-primary dark:text-white md:text-6xl md:leading-[64px] mb-8">
                Security & Infrastructure Integrity
              </h2>

              <p className="text-16-medium md:text-18-medium text-black-1/60 dark:text-white/60 mb-8 max-w-[500px]">
                We prioritize transaction security and operational transparency.
              </p>

              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-16-medium text-black-1 dark:text-white">
                  <span className="size-2 rounded-full bg-black-1 dark:bg-white" />
                  <span>End-to-end encrypted payment routing</span>
                </li>
                <li className="flex items-center gap-3 text-16-medium text-black-1 dark:text-white">
                  <span className="size-2 rounded-full bg-black-1 dark:bg-white" />
                  <span>Structured transaction audit logs</span>
                </li>
                <li className="flex items-center gap-3 text-16-medium text-black-1 dark:text-white">
                  <span className="size-2 rounded-full bg-black-1 dark:bg-white" />
                  <span>Segregated operational and settlement processes</span>
                </li>
                <li className="flex items-center gap-3 text-16-medium text-black-1 dark:text-white">
                  <span className="size-2 rounded-full bg-black-1 dark:bg-white" />
                  <span>Risk-aware monitoring systems</span>
                </li>
              </ul>

              <h3 className="text-20-bold text-primary dark:text-white mb-4">
                Transparent Rates & Liquidity Management
              </h3>

              <ul className="space-y-6 mb-10">
                <li className="flex items-center gap-3 text-18-medium text-black-1 dark:text-white md:text-20-medium">
                  <span className="size-2 rounded-full bg-black-1 dark:bg-white" />
                  <span>
                    Deposit Settlement Rate:{" "}
                    <span className="font-bold text-secondary">
                      {depositRateDisplay}
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-3 text-18-medium text-black-1 dark:text-white md:text-20-medium">
                  <span className="size-2 rounded-full bg-black-1 dark:bg-white" />
                  <span>
                    Withdrawal Settlement Rate:{" "}
                    <span className="font-bold text-secondary">
                      {withdrawalRateDisplay}
                    </span>
                  </span>
                </li>
              </ul>

              <Button
                asChild
                className="btn-secondary h-14 px-10 rounded-xl shadow-md group mb-6"
              >
                <Link href={ROUTES.SIGN_UP} className="flex items-center gap-2">
                  <span className="text-16-bold">Get Started</span>
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <p className="text-14-medium text-black-1/40 dark:text-white/40 italic">
                Discounts available for high-volume transactions
              </p>
            </div>

            {/* Right Illustration (Floating Icons) */}
            {
              <div className="relative flex items-center justify-center lg:flex-1 min-h-[350px] md:min-h-[500px]">
                {/* Concentric Circles Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20 pointer-events-none">
                  <div className="size-[200px] md:size-[300px] lg:size-[400px] rounded-full border border-black-1 dark:border-white animate-pulse" />
                  <div className="absolute size-[300px] md:size-[450px] lg:size-[600px] rounded-full border border-black-1 dark:border-white" />
                  <div className="absolute size-[400px] md:size-[600px] lg:size-[800px] rounded-full border border-black-1 dark:border-white" />
                </div>

                {/* Logo in Center */}
                <div className="relative z-10 scale-125 md:scale-150">
                  <BrandName />
                </div>

                {/* Orbiting Icons Container */}
                <div className="absolute inset-0 animate-[spin_30s_linear_infinite] pointer-events-none flex items-center justify-center">
                  {/* 
                  To space 6 items equally on a circle:
                  Each item is rotated by index * 60deg (360/6)
                  Then translated out by the radius
                  Then rotated back to stay upright
                 */}
                  {floatingIcons.map((icon) => (
                    <div
                      key={icon.name}
                      className={icon.containerClassName}
                      style={{ transform: icon.transform }}
                    >
                      <div className={icon.wrapperClassName}>
                        <Image
                          src={icon.src}
                          alt={icon.alt}
                          width={64}
                          height={64}
                          className="size-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default RatesSection;
