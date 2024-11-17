import React from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  AcademicCapIcon,
  RssIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  GlobeAmericasIcon,
  SquaresPlusIcon,
  SunIcon,
  UserGroupIcon,
  UserCircleIcon,
  UserMinusIcon,
  UserPlusIcon,
  InboxIcon,
} from "@heroicons/react/24/solid";

const navListMenuItems = [
  {
    title: "About Us",
    description: "Learn about our Objective & Motivation.",
    icon: AcademicCapIcon,
    path: "/about",
  },
  {
    title: "Features",
    description: "Find out what We are able to Provide you with.",
    icon: SunIcon,
    path: "/services",
  },
  {
    title: "Remote Access",
    description: "Browser Portal for Remote Access Connections.",
    icon: SquaresPlusIcon,
    path: "/remote-access",
  },
  {
    title: "Support Channel",
    description: "Get or Provide Support with the TechSolutions Community.",
    icon: GlobeAmericasIcon,
    path: "/support",
  },
  {
    title: "Contact-Team",
    description: "Join as a Technician or Reach out to us for any Queries.",
    icon: UserGroupIcon,
    path: "/join-team",
  },
  {
    title: "Feedback",
    description:
      "Leave or View Feedback about the Satisfaction of our Services.",
    icon: RssIcon,
    path: "/feedback",
  },
];

const AccDropDownItems = [
  {
    title: "Register",
    icon: UserGroupIcon,
    path: "/register",
  },
  {
    title: "Sign-In",
    icon: UserPlusIcon,
    path: "/login",
  },
  {
    title: "Sign-Out",
    icon: UserMinusIcon,
    path: "/logout",
  },
  {
    title: "Profile",
    icon: UserCircleIcon,
    path: "/profile",
  },
  {
    title: "Inbox",
    icon: InboxIcon,
    path: "/inbox",
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const renderItems = navListMenuItems.map(
    ({ icon, title, description, path }, key) => (
      <Link to={path} key={key}>
        <MenuItem className="flex  gap-3 rounded-lg">
          <div className="flex  justify-center rounded-lg p-2">
            {React.createElement(icon, {
              strokeWidth: 2,
              className: "h-6 text-gray-900 w-6",
            })}
          </div>
          <div>
            <Typography
              variant="h6"
              className="flex items-center text-sm font-bold text-green-400"
            >
              {title}
            </Typography>
            <Typography
              variant="paragraph"
              className="text-xs !font-medium text-gray-700"
            >
              {description}
            </Typography>
          </div>
        </MenuItem>
      </Link>
    )
  );

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-light-green-50 rounded-md bg-transparent"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Navigation
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl lg:block bg-gradient-to-tr from-light-green-50 to-light-green-100 border-0 rounded-xl mx-2">
          <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden bg-gradient-to-tr from-light-green-50 to-light-green-100 rounded-xl mx-2 max-h-[270px] overflow-auto">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}

function AccDropDown() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const renderItems = AccDropDownItems.map(({ icon, title, path }, key) => (
    <Link to={path} key={key}>
      <MenuItem className="flex items-center gap-3 rounded-lg max-h-10 overflow-auto scrollbar-hide">
        <div className="flex items-center justify-center rounded-lg p-2">
          {React.createElement(icon, {
            strokeWidth: 2,
            className: "h-6 text-gray-900 w-6",
          })}
        </div>
        <div>
          <Typography
            variant="h6"
            className="flex items-center text-sm font-bold text-green-400"
          >
            {title}
          </Typography>
        </div>
      </MenuItem>
    </Link>
  ));

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-light-green-50 bg-transparent rounded-md"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Account
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl lg:block bg-gradient-to-tr from-light-green-50 to-light-green-100 border-0 rounded-xl mx-2">
          <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden bg-gradient-to-tr from-light-green-50 to-light-green-100 rounded-xl mx-2">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}

function NavList() {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1 opacity-75 ">
      <Typography
        as="a"
        href="/ticket"
        variant="small"
        color="light-green"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4 text-light-green-50 rounded-md bg-transparent">
          Ticket
        </ListItem>
      </Typography>
      <Typography
        as="a"
        href="#"
        variant="small"
        color="light-green"
        className="font-medium"
      >
        <ListItem className="flex items-center  py-2 pr-4 text-light-green-50 rounded-md bg-transparent">
          Policies
        </ListItem>
      </Typography>
      <NavListMenu />
      <AccDropDown />
    </List>
  );
}

export function NavbarMain() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar
      className="mx-auto bg-gradient-to-tr from-gray-900 to-brown-900 border-0 py-2 px-4 fixed z-20"
      fullWidth={true}
    >
      <div className="flex items-center justify-between text-light-green-50 w-full ">
        <div className="flex items-center ">
          <Link to="/">
            <img src={logo} alt="TechSolutions Logo" className="h-8 w-auto" />
          </Link>
          <Typography
            as={Link}
            to="/"
            variant="h6"
            className="mr-4 cursor-pointer py-1.5 lg:ml-2"
          >
            Tech-Solutions
          </Typography>
        </div>
        <div className="hidden lg:flex lg:items-center lg:ml-auto lg:gap-2">
          <NavList />
          <div className="ml-6"></div>

          <a
            target="_blank"
            href="https://northsouth0-my.sharepoint.com/:u:/g/personal/nafiz_iqbal_northsouth_edu/ESyxaJvqbXVLp5wiBxFY1yEBdFPm755DUYFfzvKvt1xaTA?e=DC89zM"
          >
            <Button
              variant="gradient"
              color="brown"
              size="sm"
              className="flex items-center border-2 border-brown-300"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Download
            </Button>
          </a>
        </div>
        <IconButton
          variant="text"
          color="white"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>

      <Collapse open={openNav}>
        <NavList />
        <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
          <Link to="/download" className="w-full">
            <Button
              variant="filled"
              size="sm"
              color="brown"
              fullWidth
              className="flex items-center border-2 border-brown-300"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Download
            </Button>
          </Link>
        </div>
      </Collapse>
    </Navbar>
  );
}

export default NavbarMain;
