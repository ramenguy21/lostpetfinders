interface ProductCardProps {
  heading: string;
  description?: string;
  id: string;
  img: string;
}

export default function ProductCard(props: ProductCardProps) {
  return (
    <div className="bg-neutral flex flex-col rounded p-5">
      <img className="h-auto max-w-full" src={props.img} />
      <h3 className="my-2 text-2xl font-bold">{props.heading}</h3>
      <p>{props.description}</p>
    </div>
  );
}
