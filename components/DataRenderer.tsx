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
    return (
      <div className="flex-center flex-col rounded-lg flex w-full 2xl:max-w-[404px] h-[203px] bg-white_dark-black-1">
        <p className="font-medium">{empty?.title || " No record yet!"}</p>
        {empty?.mesage && <em className="text-12-medium">{empty.mesage}</em>}
      </div>
    );
  }

  return <>{render(data)}</>;
};

export default DataRenderer;
