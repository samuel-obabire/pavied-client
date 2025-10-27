import { Separator } from '@radix-ui/react-separator'

const Divider = ({ className }: { className?: string }) => {
 return <Separator className={`dark:border-accent/10 border-black-1/10  mb-2 w-full border-1 ${className && className}`} />
}

export default Divider
