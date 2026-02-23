type Props<T> = {
  success: boolean;
  data: T[] | null | undefined;
  error?: {
    code?: string;
    message?: string;
  };
  empty?: {
    title?: string;
    message?: string;
    action?: React.ReactNode;
    component?: React.ReactNode;
  };
  render: (data: T[]) => React.ReactNode;
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
        {empty?.component ? (
          empty.component
        ) : (
          <p className="font-medium">{empty?.title || " No record yet!"}</p>
        )}
        {empty?.message && (
          <em className="text-12-medium text-center">{empty.message}</em>
        )}
        {empty?.action && <div className="mt-4">{empty.action}</div>}
      </div>
    );
  }

  return <>{render(data)}</>;
};

export default DataRenderer;
