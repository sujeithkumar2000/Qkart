import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {

  return (
    <Card className="card">
       <CardMedia
        component="img"
        // height="140"
        image={product.image}
        alt={product._id}
      />
    <CardContent>
      <Typography color="primary" variant="h5">
        {product.name}
      </Typography>
      <Typography color="textSecondary" variant="subtitle2">
        {product.category}
      </Typography>
      <Typography color="textSecondary" variant="subtitle2">
        ${product.cost}
      </Typography>
      <Rating name="size-medium" defaultValue={product.rating} readOnly/>
      <br />
      <CardActions className="card-actions">
          <Button fullWidth className="card-button" variant="contained" onClick={handleAddToCart} startIcon={<AddShoppingCartOutlined />
          } color="success" >
            Add to Cart
          </Button>
        </CardActions>
    </CardContent>

    </Card>
   
  );
};

export default ProductCard;
