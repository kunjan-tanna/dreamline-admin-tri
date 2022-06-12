import React from "react";
import {
  Home as HomeIcon,
  Help as HelpIcon,
  Chat as ChatIcon,
  Add as AddSectionIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  Reorder as ReorderIcon,
  FindInPage as FindInPageIcon,
  Drafts as DraftsIcon,
  Apps as AppsIcon,
  AspectRatio as AspectRatioIcon,
} from "@material-ui/icons";

import { makeStyles } from "@material-ui/styles";

// components
import Dot from "./components/Dot";

const structure = [
  {
    id: 0,
    label: "Dashboard",
    link: process.env.PUBLIC_URL + "/app/dashboard",
    icon: <HomeIcon />,
  },
  // {
  //     id: 1,
  //     label: 'Questions',
  //     link: process.env.PUBLIC_URL + '/app/questions',
  //     icon: <HelpIcon />,
  //     // children: [
  //     //     {
  //     //         label: 'Question Manage',
  //     //         link: process.env.PUBLIC_URL + '/app/questions/management',
  //     //     },
  //     // ],
  // },
  {
    id: 2,
    label: "Products",
    link: process.env.PUBLIC_URL + "/app/products",
    icon: <WorkIcon />,
    // children: [
    //     {
    //         label: 'Profession List',
    //         link: process.env.PUBLIC_URL + '/app/professions/list',
    //     },
    // ],
  },
  {
    id: 2,
    label: "Categories",
    link: process.env.PUBLIC_URL + "/app/categories",
    icon: <AppsIcon />,
    // children: [
    //     {
    //         label: 'Profession List',
    //         link: process.env.PUBLIC_URL + '/app/professions/list',
    //     },
    // ],
  },
  {
    id: 2,
    label: "Size",
    link: process.env.PUBLIC_URL + "/app/sizes",
    icon: <AspectRatioIcon />,
    // children: [
    //     {
    //         label: 'Profession List',
    //         link: process.env.PUBLIC_URL + '/app/professions/list',
    //     },
    // ],
  },
  {
    id: 2,
    label: "Style Bundles",
    link: process.env.PUBLIC_URL + "/app/stylebundle",
    icon: <ReorderIcon />,
    // children: [
    //     {
    //         label: 'Profession List',
    //         link: process.env.PUBLIC_URL + '/app/professions/list',
    //     },
    // ],
  },
  {
    id: 3,
    label: "Accessories",
    link: process.env.PUBLIC_URL + "/app/accessories",
    icon: <SchoolIcon />,
    // children: [
    //     {
    //         label: 'Education List',
    //         link: process.env.PUBLIC_URL + '/app/educations/list',
    //     },
    // ],
  },
  {
    id: 4,
    label: "Users",
    link: process.env.PUBLIC_URL + "/app/users",
    icon: <GroupIcon />,
    //     // children: [
    //     //     {
    //     //         label: 'Users List',
    //     //         link: process.env.PUBLIC_URL + '/app/users/list',
    //     //     },
    //     // ],
  },
  {
    id: 5,
    label: "Product Modification",
    link: process.env.PUBLIC_URL + "/app/modification",
    icon: <AssessmentIcon />,
    //     // children: [
    //     //     {
    //     //         label: 'Users List',
    //     //         link: process.env.PUBLIC_URL + '/app/users/list',
    //     //     },
    //     // ],
  },
  {
    id: 6,
    label: "Faq",
    link: process.env.PUBLIC_URL + "/app/faq",
    icon: <HelpIcon />,
    //     // children: [
    //     //     {
    //     //         label: 'Users List',
    //     //         link: process.env.PUBLIC_URL + '/app/users/list',
    //     //     },
    //     // ],
  },
  {
    id: 6,
    label: "Content Pages",
    link: process.env.PUBLIC_URL + "/app/pages",
    icon: <FindInPageIcon />,
    //     // children: [
    //     //     {
    //     //         label: 'Users List',
    //     //         link: process.env.PUBLIC_URL + '/app/users/list',
    //     //     },
    //     // ],
  },
  {
    id: 7,
    label: "Banner Ads",
    link: process.env.PUBLIC_URL + "/app/banner",
    icon: <MonetizationOnIcon />,
    //     // children: [
    //     //     {
    //     //         label: 'Users List',
    //     //         link: process.env.PUBLIC_URL + '/app/users/list',
    //     //     },
    //     // ],
  },
  {
    id: 8,
    label: "Orders",
    link: process.env.PUBLIC_URL + "/app/order",
    icon: <ReorderIcon />,
    //     // children: [
    //     //     {
    //     //         label: 'Users List',
    //     //         link: process.env.PUBLIC_URL + '/app/users/list',
    //     //     },
    //     // ],
  },
  {
    id: 8,
    label: "Drafts",
    link: process.env.PUBLIC_URL + "/app/draft",
    icon: <DraftsIcon />,
    //     // children: [
    //     //     {
    //     //         label: 'Users List',
    //     //         link: process.env.PUBLIC_URL + '/app/users/list',
    //     //     },
    //     // ],
  },
  // {
  //     id: 5,
  //     label: 'Reports',
  //     link: process.env.PUBLIC_URL + '/app/reports',
  //     icon: <AssessmentIcon />,
  //     // children: [
  //     //     {
  //     //         label: 'Reported Users',
  //     //         link: process.env.PUBLIC_URL + '/app/reports/list',
  //     //     },
  //     // ],
  // },
  // {
  //     id: 6,
  //     label: 'Subscriptions',
  //     link: process.env.PUBLIC_URL + '/app/subscriptions',
  //     icon: <MonetizationOnIcon />,
  //     children: [
  //         {
  //             label: 'Plans',
  //             link: process.env.PUBLIC_URL + '/app/subscriptions/plans',
  //         },{
  //             label: 'Subscribers',
  //             link: process.env.PUBLIC_URL + '/app/subscriptions/subscribers',
  //         },
  //     ],
  // },
];

function AddSection() {
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: "50%",
      height: 30,
      width: 30,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
    },
  }));

  const classes = useStyles();

  return (
    <section className={classes.root}>
      <AddSectionIcon />
    </section>
  );
}

function Chat() {
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: "50%",
      height: 45,
      width: 45,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
    },
  }));

  const classes = useStyles();

  return (
    <>
      <section className={classes.root}>
        <ChatIcon />
      </section>
    </>
  );
}

export default structure;
