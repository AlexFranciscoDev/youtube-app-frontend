import { Link } from "react-router-dom";
import { resolveUploadUrl } from "../helpers/Global";
import "./CategoryCard.css";

interface CategoryCardProps {
  _id: string;
  name: string;
  image: string;
}

const CategoryCard = ({ _id, name, image }: CategoryCardProps) => {
  const imageSrc = resolveUploadUrl(image, "categories");

  return (
    <Link to={`/category/${_id}`} className="ccard">
      <div className="ccard__thumbnail-wrapper">
        <img src={imageSrc} alt={name} className="ccard__thumbnail" />
      </div>
      <h3 className="ccard__name">{name}</h3>
    </Link>
  );
};

export default CategoryCard;
