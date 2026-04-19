import * as React from "react";

const Form = ({ children, ...props }) => <form {...props}>{children}</form>;

export { Form };
