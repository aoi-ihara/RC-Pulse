import { IconView } from "./Icon";

type Task = {
    date: string;
    heading: string;
    title: string;
    explanation?: string;
    url?: string;
};

export function TaskItems({ tasks }: { tasks: Task[] }) {
    return (
        <div className="my-2 px-4 py-2.5 border text-[calc(14px+0.1dvw)] border-(--color-border) rounded-2xl">
            {tasks.length == 0 ? (
                <div className="w-full text-center opacity-25">
                    アラートなし
                </div>
            ) : (
                <div className="cursor-default tracking-wider flex flex-col gap-4">
                    {tasks.map((item, index) => {
                        return (
                            <div className="flex" key={index}>
                                <span className="w-[calc(72px+0.4dvw)] shrink-0 tracking-normal opacity-50 font-bold inline-block">
                                    {(index == 0 ||
                                        item.date != tasks[index - 1].date) &&
                                        item.date}
                                </span>
                                <div className="min-w-0 wrap-break-word">
                                    {item.url ? (
                                        <a
                                            target="_blank"
                                            href={item.url}
                                            className="font-bold flex gap-2 underline active:no-underline"
                                        >
                                            <IconView
                                                name={item.heading.slice(0, 1)}
                                            />
                                            {item.heading.slice(1) == "1" ? (
                                                <IconView name="A" />
                                            ) : item.heading.slice(1) == "2" ? (
                                                <IconView name="B" />
                                            ) : null}
                                            {item.title}
                                        </a>
                                    ) : (
                                        <a className="font-bold flex gap-2">
                                            <IconView
                                                name={item.heading.slice(0, 1)}
                                            />
                                            {item.heading.slice(1) == "1" ? (
                                                <IconView name="A" />
                                            ) : item.heading.slice(1) == "2" ? (
                                                <IconView name="B" />
                                            ) : null}
                                            {item.title}
                                        </a>
                                    )}
                                    <div className="opacity-50 text-[calc(12.6px+0.09dvw)]">
                                        {item.explanation}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
