import React from "react";
import Button from "../fields/ButtonWidget";

export default function ButtonInput(props) {
  const { uiFieldSchema } = props;
  return <Button uiFieldSchema={uiFieldSchema} />;
}
