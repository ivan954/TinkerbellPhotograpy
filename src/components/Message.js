import React from "react";
import { Alert } from "react-bootstrap";
import commonData from "../data/components/screens/common.json";

const Message = ({ variant, children }) => {
  const defaultVariant = commonData.message.defaultVariant;
  return <Alert variant={variant || defaultVariant}>{children}</Alert>;
};

export default Message;
