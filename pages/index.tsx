// types for typescript
import React from "react";

import type { NextPage } from "next";
import { Fragment } from "react";

import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <Fragment>
      <Layout />
    </Fragment>
  );
};

export default Home;
