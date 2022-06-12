import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";
import { Box, Grid, Breadcrumbs, Tabs, Tab } from "@material-ui/core";
import { NavigateNext as NavigateNextIcon } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";
import Widget from "../Widget";
import { Typography } from "../../components/Wrappers";

// pages
import Dashboard from "../../pages/dashboard";
import Questions from "../../pages/questions";
import Professions from "../../pages/professions";
import Educations from "../../pages/educations";
import Users from "../../pages/users";
import UserDetails from "../../pages/users/UserDetails";
import Reports from "../../pages/reports";
import Subscriptions from "../../pages/subscriptions";
import Modifications from "../../pages/modifications";
import Faq from "../../pages/faq";
import Content from "../../pages/content";
import Banner from "../../pages/banner";
import Order from "../../pages/order";
import OrderDetails from "../../pages/order/OrderDetails";
import Draft from "../../pages/draft";
import DraftDetails from "../../pages/draft/DraftDetails";
//styleBundles
import StyleBundle from "../../pages/styleBundle/StyleBundle";
import AddStyleBundle from "../../pages/styleBundle/AddStyleBundle";
import UpdateStyleBundle from "../../pages/styleBundle/UpdateStyleBundle";
//Categories
import Categories from "../../pages/categories/categories";
//Sizes
import Sizes from "../../pages/size/sizes";
//Products
import Products from "../../pages/products/products";
//Accessories
import Accessories from "../../pages/accessories/accessories";
//Product Modifications
import ProductModification from "../../pages/ProductModification/ProductModification";
//EXPORT PDF
import ExportPdfComponent from "../../pages/order/ExportPdfComponent";

// context
import { useLayoutState } from "../../context/LayoutContext";
import { DashboardProvider } from "../../context/DashboardContext";
import { QuestionsProvider } from "../../context/QuestionsContext";
import { ProfessionsProvider } from "../../context/ProfessionsContext";
import { EducationsProvider } from "../../context/EducationsContext";
import { UsersProvider } from "../../context/UsersContext";
import { ReportsProvider } from "../../context/ReportsContext";
import { SubscriptionsProvider } from "../../context/SubscriptionsContext";
import { ModificationsProvider } from "../../context/ModificationsContext";
import { FaqProvider } from "../../context/FaqContext";
import { ContentProvider } from "../../context/ContentContext";
import { BannerProvider } from "../../context/BannerContext";
import { OrderProvider } from "../../context/OrderContext";
import { DraftProvider } from "../../context/DraftContext";

//Sidebar structure
import structure from "../Sidebar/SidebarStructure";

// Tab styling

const CustomTab = withStyles((theme) => ({
  root: {
    minWidth: 72,
    textTransform: "none",
    fontWeight: 400,
  },
}))((props) => <Tab {...props} />);

function Layout(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(2);
  // global
  var layoutState = useLayoutState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <div className={classes.root}>
      <Header history={props.history} />
      <Sidebar structure={structure} />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <Widget
          disableWidgetMenu
          inheritHeight
          className={classes.margin}
          bodyClass={classes.navPadding}
        >
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            wrap={"nowrap"}
            style={{ overflowX: "auto" }}
          >
            {structure.map((c) => {
              if (
                !c.children &&
                window.location.hash.includes(c.link) &&
                c.link
              ) {
                return (
                  <Box display="flex" alignItems="center" key={c.id}>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography variant="h4">{c.label}</Typography>
                    </Breadcrumbs>
                    {window.location.hash.includes("/app/dashboard") && (
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="simple tabs example"
                        variant="scrollable"
                        scrollButtons="auto"
                        style={{ marginLeft: 38 }}
                      >
                        <CustomTab label="Today" {...a11yProps(0)} />
                        <CustomTab label="This week" {...a11yProps(1)} />
                        <CustomTab label="This month" {...a11yProps(2)} />
                        <CustomTab label="This year" {...a11yProps(3)} />
                      </Tabs>
                    )}
                  </Box>
                );
              } else if (c.children) {
                return c.children.map((currentInner) => {
                  if (window.location.hash.includes(currentInner.link)) {
                    return (
                      <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb"
                        key={c.id}
                      >
                        <Typography variant={"h6"}>{c.label}</Typography>
                        <Typography variant={"h6"} color="primary">
                          {currentInner.label}
                        </Typography>
                      </Breadcrumbs>
                    );
                  } else {
                    return null;
                  }
                });
              } else {
                return null;
              }
            })}
          </Grid>
        </Widget>
        <Switch>
          <Route path={process.env.PUBLIC_URL + "/app/dashboard"} exact>
            <DashboardProvider>
              <Dashboard />
            </DashboardProvider>
          </Route>
          {/* <Route path={process.env.PUBLIC_URL + "/app/questions"} exact >
                        <QuestionsProvider>
                            <Questions />
                        </QuestionsProvider>
                    </Route> */}
          <Route path={process.env.PUBLIC_URL + "/app/product"} exact>
            <ProfessionsProvider>
              <Professions />
            </ProfessionsProvider>
          </Route>
          {/* Stylebundle Page */}
          <Route path={process.env.PUBLIC_URL + "/app/stylebundle"} exact>
            <StyleBundle />
          </Route>
          <Route path={process.env.PUBLIC_URL + "/app/addstylebundle"} exact>
            <AddStyleBundle />
          </Route>
          <Route path={process.env.PUBLIC_URL + "/app/updatestylebundle"} exact>
            <UpdateStyleBundle />
          </Route>
          {/* Categories Pages */}
          <Route path={process.env.PUBLIC_URL + "/app/categories"} exact>
            <Categories />
          </Route>
          {/* Sizes Pages */}
          <Route path={process.env.PUBLIC_URL + "/app/sizes"} exact>
            <Sizes />
          </Route>

          {/* Products pages */}
          <Route path={process.env.PUBLIC_URL + "/app/products"} exact>
            <Products />
          </Route>
          {/* Accessories pages */}
          <Route path={process.env.PUBLIC_URL + "/app/accessories"} exact>
            <Accessories />
          </Route>
          {/* Product Modifications pages */}
          <Route path={process.env.PUBLIC_URL + "/app/modification"} exact>
            <ProductModification />
          </Route>
          {/* EXPORT PDF PAGE*/}
          <Route path={process.env.PUBLIC_URL + "/app/exportPDF"} exact>
            <ExportPdfComponent />
          </Route>
          {/* <Route path={process.env.PUBLIC_URL + "/app/accessories"} exact>
            <EducationsProvider>
              <Educations />
            </EducationsProvider>
          </Route> */}
          <Route path={process.env.PUBLIC_URL + "/app/users"} exact>
            <UsersProvider>
              <Users />
            </UsersProvider>
          </Route>
          <Route path={process.env.PUBLIC_URL + "/app/users/details"} exact>
            <UsersProvider>
              <UserDetails />
            </UsersProvider>
          </Route>
          {/* <Route path={process.env.PUBLIC_URL + "/app/modification"} exact>
            <ModificationsProvider>
              <Modifications />
            </ModificationsProvider>
          </Route> */}
          <Route path={process.env.PUBLIC_URL + "/app/faq"} exact>
            <FaqProvider>
              <Faq />
            </FaqProvider>
          </Route>
          <Route path={process.env.PUBLIC_URL + "/app/pages"} exact>
            <ContentProvider>
              <Content />
            </ContentProvider>
          </Route>
          <Route path={process.env.PUBLIC_URL + "/app/banner"} exact>
            <BannerProvider>
              <Banner />
            </BannerProvider>
          </Route>
          <Route path={process.env.PUBLIC_URL + "/app/order"} exact>
            <OrderProvider>
              <Order />
            </OrderProvider>
          </Route>
          <Route path={process.env.PUBLIC_URL + "/app/order/details"} exact>
            <OrderProvider>
              <OrderDetails />
            </OrderProvider>
          </Route>

          <Route path={process.env.PUBLIC_URL + "/app/draft"} exact>
            <DraftProvider>
              <Draft />
            </DraftProvider>
          </Route>
          <Route path={process.env.PUBLIC_URL + "/app/draft/details"} exact>
            <DraftProvider>
              <DraftDetails />
            </DraftProvider>
          </Route>
          {/*<Route path={process.env.PUBLIC_URL + "/app/reports"} exact >
                        <ReportsProvider>
                            <Reports />
                        </ReportsProvider>
                    </Route>
                    <Route
                        exact
                        path="/app/subscriptions"
                        render={() => <Redirect to="/app/subscriptions/plans" />}
                    />
                    <Route path={process.env.PUBLIC_URL + "/app/subscriptions/plans"} exact >
                        <SubscriptionsProvider>
                            <Subscriptions />
                        </SubscriptionsProvider>
                    </Route> */}
        </Switch>
      </div>
    </div>
  );
}

export default withRouter(Layout);
