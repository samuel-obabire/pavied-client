type Props<T> = {
  success: boolean;
  data: T[] | null | undefined;
  error?: {
    code?: string;
    message?: string;
  };
  empty?: {
    title: string;
    mesage: string;
  };
  render: (data: T[]) => void;
};

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty,
  render,
}: Props<T>) => {
  if (!success) {
    return (
      <div className="flex-center flex w-full">
        {error?.message ?? "An error occured"}
      </div>
    );
  }

  if (!data || !data.length) {
    return <div className="flex-center flex w-full">Empty state</div>;
  }

  return <>{render(data)}</>;
};

export default DataRenderer;
