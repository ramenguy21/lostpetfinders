interface ProductCardProps {
  heading: string;
  description?: string;
  id: string;
  img: string;
}

export default function ProductCard(props: ProductCardProps) {
  return (
    <div className="flex flex-col rounded bg-neutral p-5">
      <img alt="" className="h-auto max-w-full" src={props.img} />
      <h3 className="my-2 text-2xl font-bold">{props.heading}</h3>
      <p>{props.description}</p>
    </div>
  );
}
