import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField as Input,
  CircularProgress,
  Select,
  MenuItem,
} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Widget from "../../components/Widget";
import { Button } from "../../components/Wrappers";
import Input2 from "@material-ui/core/Input";
import { Multiselect } from "multiselect-react-dropdown";
import {
  Switch,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import ErrorMessage from "../../components/ErrorMessage";

import useStyles from "./styles";
import alertify from "alertifyjs";
import "alertifyjs/build/css/themes/default.min.css";
import "alertifyjs/build/css/alertify.min.css";
import joi from "joi-browser";
import "./styles.css";
//context
import {
  useProfessionsState,
  getProfessionsRequest,
  updateProfessionStatus,
  deleteProfession,
  createProfession,
  updateProfession,
  getCategoryListRequest,
} from "../../context/ProfessionsContext";

import { Typography } from "../../components/Wrappers";

// Icons
import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
} from "@material-ui/icons";
import { apiCall, displayLog, validate } from "../../common/common";
const FormData = require("form-data");
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy].toLowerCase() < a[orderBy].toLowerCase()) {
    return -1;
  }
  if (b[orderBy].toLowerCase() > a[orderBy].toLowerCase()) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    numeric: true,
    disablePadding: false,
    label: "#",
    sort: false,
    width: "50px",
  },
  {
    id: "product_name",
    numeric: true,
    disablePadding: false,
    label: "NAME",
    sort: true,
    width: "200px",
  },
  // { id: 'product_code', numeric: true, disablePadding: false, label: 'PRODUCT CODE', sort: true },
  {
    id: "size_type",
    numeric: true,
    disablePadding: false,
    label: "SIZE TYPE",
    sort: true,
    width: "200px",
  },
  {
    id: "is_active",
    numeric: true,
    disablePadding: false,
    label: "STATUS",
    sort: false,
    width: "100px",
  },
  {
    id: "actions",
    numeric: true,
    center: true,
    width: "180px",
    disablePadding: false,
    label: "ACTIONS",
    sort: false,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            width={headCell.width}
            key={index}
            align={
              headCell.center ? "center" : headCell.numeric ? "left" : "right"
            }
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography noWrap weight={"medium"} variant={"body2"}>
                  {headCell.label}
                </Typography>
              </TableSortLabel>
            ) : (
              <Typography noWrap weight={"medium"} variant={"body2"}>
                {headCell.label}
              </Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const Professions = () => {
  const classes = useStyles();
  const context = useProfessionsState();
  var [professions, setBackProfessions] = useState(
    context.professions.professions
  );
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("product_name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formValues, setFormValues] = useState({});
  const [wantToEdit, setWantToEdit] = useState(false);
  const [error, setError] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleInputModal, setToggleInputModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    size: [],
    color: [],
    style_bundle: [],
  });
  let [sizeData, setSizeData] = useState([{ l: "", w: "", h: "" }]);
  let [sizearr, setSizeArr] = useState([]);

  // PARTH STATE - 04-05-2021
  const [commonCode, setCommonCode] = useState(false);
  //-----------------

  const [sizeValueNull, setSizeValueNull] = useState(false);
  let dataSize = [];
  let prodCode = [];
  let acronym = "";
  let lng, wgt;
  useEffect(() => {
    getProfessionsRequest(context.setProfessions);
    getCategoryListRequest(context.setCategoryList);
  }, []); // eslint-disable-line

  useEffect(() => {
    setBackProfessions(context.professions.professions);
  }, [context]);

  useEffect(() => {
    if (
      formValues &&
      formValues.product_name &&
      newProduct &&
      newProduct.size_type
    ) {
      if (!wantToEdit || commonCode) {
        genCommonCode();
      }
    }
  }, [formValues.product_name, newProduct.style_bundle, newProduct.size_type]);

  const handleInputChange = (e, index) => {
    setCommonCode(wantToEdit ? true : false);

    setSizeValueNull(false);
    if (wantToEdit) {
      const { name, value } = e.target;
      const listedit = [...sizearr];
      console.log("LISTTT", listedit);
      listedit[index][name] = value;
      setSizeArr(listedit);
      setNewProduct({
        ...newProduct,
        size: sizearr,
      });
    } else {
      let sizeArr = [];
      console.log("FOMRVALUESIZE", formValues.size);
      if (
        formValues.size != undefined &&
        formValues.size &&
        JSON.parse(formValues.size).length > 0
      ) {
        // let i
        JSON.parse(formValues.size).forEach((x, i) => {
          sizeArr.push({
            w: x.split("*")["0"],
            l: x.split("*")["1"],
            h: x.split("*")["2"],
          });
        });

        setSizeArr(sizeArr);
      }
      const { name, value } = e.target;
      const list = [...sizeData];
      /* console.log(value)
            if(e.target.value.trim() == '')
            {               
                setSizeValueNull(true)               
                 
            } else {
                setSizeValueNull(false)
            } */
      list[index][name] = value;

      setSizeData(list);
      setNewProduct({
        ...newProduct,
        size: sizeData,
      });
    }
  };
  const handleChangeColor = (event) => {
    setNewProduct({
      ...newProduct,
      color: event.target.value,
    });
  };
  const handleChangeStyleBundle = (event) => {
    setCommonCode(wantToEdit ? true : false);

    setNewProduct({
      ...newProduct,
      style_bundle: event.target.value,
    });
  };

  const addMoreLH = (size) => {
    setNewProduct({ ...newProduct, size_type: size });
  };

  const handleChangeSize = (e) => {
    setCommonCode(wantToEdit ? true : false);

    setNewProduct({
      ...newProduct,
      //   [e.target.name]: e.target.value,
      size_type: e.target.value,
    });
  };

  const handleRequestSort = (event, property) => {
    // console.log("EVENT", property);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    // alert(newPage)
    /* setPage(newPage+1)
        reqparam = { 
            page:newPage+1,
            limit:rowsPerPage,
            sortby:1,
            sortorder:"asc" 
        }
        await getProfessionsRequest(context.setProfessions,reqparam);
        // console.log(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = async (event, profession_id) => {
    await updateProfessionStatus(context.setProfessions, {
      status: event.target.checked ? 1 : 0,
      product_id: profession_id,
    });
    await getProfessionsRequest(context.setProfessions);
  };
  const deleteProfessionHandler = async (e, profession_id) => {
    e.preventDefault();
    alertify
      .confirm("Are you sure you want to delete?", async (status) => {
        if (status) {
          await deleteProfession(context.setProfessions, {
            id: profession_id,
          });
          await getProfessionsRequest(context.setProfessions);
        }
      })
      .setHeader("<em>Dreamline</em> ")
      .set("labels", { ok: "OK", cancel: "CANCEL" });
  };
  const manageModal = (wantToEdit, profession) => {
    console.log("WANNNTT", wantToEdit, "prossion", profession);
    let sizeArr = [];
    setError("");
    setErrorField("");
    setSizeData([{ l: "", w: "", h: "" }]);
    setWantToEdit(wantToEdit);
    if (wantToEdit) {
      console.log("EDIT DATA:::", profession.size);
      JSON.parse(profession.size).forEach((x, i) => {
        // console.log("EDIT:::", x);
        sizeArr.push({
          w: x.split("*")["0"],
          l: x.split("*")["1"],
          h: x.split("*")["2"],
        });
      });

      setSizeArr(sizeArr);
      console.log("bbbbbbbbbbbbbbbbbbbbbbbbb", sizeArr);
      setNewProduct({
        ...newProduct,
        size: sizeArr,
      });

      console.log("formValues ==>", newProduct);
      setFormValues({ ...formValues, size: profession.size });
      // if (newProduct.size_type == undefined) {
      // newProduct.size_type = formValues.size_type
      setNewProduct({ ...newProduct, size_type: "" });
      setFormValues({ ...formValues, size_type: "" });
      setNewProduct({ ...newProduct, size_type: profession.size_type });

      // }
    } else {
      setSizeArr([]);
      // setSizeData([])
      // sizearr = []
      setNewProduct({
        ...newProduct,
        size: [],
        color: [],
        style_bundle: [],
        size_type: "",
      });
    }

    // profession ? setFormValues(profession) : setFormValues({ profession_name: '' })
    console.log("PROFESSION---::", profession);
    profession
      ? setFormValues({
          ...profession,
          product_code: formValues.product_code
            ? formValues.product_code
            : profession.product_code,
        })
      : setFormValues({ profession_name: "" });
    setToggleInputModal(true);
  };

  let data = [];
  data = newProduct.size;
  console.log("data ===>", data);

  /* -------------------------------------------------------------------  */
  //DATA IS EMPTY SO THIS FN IS NOT RUN ---CODE:: ALREADY DEVELOPED FOR PREVIOUS DEVELOPER
  data.forEach((c, i) => {
    // console.log("datllll===>", c);

    if (newProduct.size_type == 1) {
      if (c.l.trim() == "" || c.w.trim() == "") {
        // displayLog(0, 'Please Enter valid size!')
        return false;
        if (!sizeValueNull) {
          setSizeValueNull(true);
        } else {
          setSizeValueNull(false);
        }
      }
      let data1 = `${c.w}*${c.l}`;
      dataSize.push(data1);
      if (formValues.product_name != "" && formValues.product_name != null) {
        let str = formValues.product_name;
        let matches = str.match(/\b(\w)/g);
        acronym = matches.join("").toUpperCase();
        lng = c.l;
        if (c.l.length == 1) {
          lng = "0" + c.l;
        }
        wgt = c.w;
        if (c.w.length == 1) {
          wgt = "0" + c.w;
        }
        let code = acronym + `${wgt}` + `${lng}`;
        // console.log("FIRST CHAR=>",code)
        prodCode.push(code);
      }
    } else if (newProduct.size_type == 2) {
      if (c.l.trim() == "" || c.w.trim() == "" || c.h.trim() == "") {
        // displayLog(0, 'Please Enter valid size!')
        return false;
        /* if(!sizeValueNull) {
                    setSizeValueNull(true)
                } else {
                    setSizeValueNull(false)
                } */
      }
      let data1 = `${c.w}*${c.l}*${c.h}`;
      // console.log(newProduct.size_type)
      dataSize.push(data1);
      if (formValues.product_name != "" && formValues.product_name != null) {
        let str = formValues.product_name;
        let matches = str.match(/\b(\w)/g);
        acronym = matches.join("").toUpperCase();
        lng = c.l;
        if (c.l.length == 1) {
          lng = "0" + c.l;
        }
        wgt = c.w;
        if (c.w.length == 1) {
          wgt = "0" + c.w;
        }
        let hgt = c.h;
        if (c.h.length == 1) {
          hgt = "0" + c.h;
        }
        let code = acronym + `${wgt}` + `${lng}` + `${hgt}`;
        prodCode.push(code);
      }
    } else if (newProduct.size_type == 3) {
      let data1 = `${c.l}`;
      dataSize.push(data1);
    }
  });
  /* -----------------------------------------------------------------  */

  const handleChangeSelect = (e) => {
    // console.log("SSSS", e.target.value);
    setCommonCode(wantToEdit ? true : false);

    // setAction(e.target.value);
    setFormValues({
      ...formValues,
      categories: e.target.value,
    });
  };

  if (formValues.color && newProduct.color.length == 0) {
    newProduct.color = JSON.parse(formValues.color);
  } else {
    newProduct.color = newProduct.color;
  }
  if (formValues.style_bundle && newProduct.style_bundle.length == 0) {
    newProduct.style_bundle = JSON.parse(formValues.style_bundle);
  } else {
    newProduct.style_bundle = newProduct.style_bundle;
  }

  if (newProduct.size_type == undefined) {
    newProduct.size_type = formValues.size_type;
  }
  const handleAddClick = () => {
    setSizeData([...sizeData, { w: "", l: "", h: "" }]);
    setSizeArr([...sizearr, { w: "", l: "", h: "" }]);
  };

  const handleRemoveClick = (index) => {
    // console.log("SIZEDATA", [...sizeData]);
    const list = [...sizeData];
    list.splice(index, 1);
    // console.log("LISTT", list);
    setSizeData(list);
    if (wantToEdit) {
      const list = [...sizearr];
      list.splice(index, 1);
      setSizeArr(list);
      setNewProduct({
        ...newProduct,
        size: list,
      });
      // console.log(JSON.parse(formValues.size).splice(index,1))
    }
  };

  const submitProfessionHandler = () => {
    console.log("SIZE", sizearr);
    if (sizeValueNull) {
      displayLog(0, "Please Enter valid size");
      return false;
      // console.log('submit button')
      // setError('size')
      // setErrorField('Please Enter valid size')
    } else {
      if (wantToEdit && dataSize.length == 0) {
        // let data = [];
        if (data.length == 0) {
          data = sizearr;
        }
        console.log("size_type ===>", newProduct.size_type);
        data.forEach((c, i) => {
          // alert('1')
          if (newProduct.size_type == 1) {
            if (c.l.trim() == "" || c.w.trim() == "") {
              // displayLog(0, 'Please Enter valid size!')
              if (!sizeValueNull) {
                setSizeValueNull(true);
              } else {
                setSizeValueNull(false);
              }
              return false;
            }

            let data1 = `${c.w}*${c.l}`;
            dataSize.push(data1);
            // console.log("SIZE", dataSize);
            if (
              formValues.product_name != "" &&
              formValues.product_name != null
            ) {
              let str = formValues.product_name;
              let matches = str.match(/\b(\w)/g);
              acronym = matches.join("").toUpperCase();
              let lng = c.l;
              console.log("SIZE=====", lng);
              if (c.l.length == 1) {
                // alert()
                let lng = "0" + c.l;
              }
              let wgt = c.w;
              if (c.w.length == 1) {
                let wgt = "0" + c.w;
              }
              let code = acronym + `${wgt}` + `${lng}`;
              prodCode.push(code);
            }
          } else if (newProduct.size_type == 2) {
            if (c.l.trim() == "" || c.w.trim() == "" || c.h.trim() == "") {
              displayLog(0, "Please Enter valid size!");
              return false;
            }
            let data1 = `${c.w}*${c.l}*${c.h}`;
            dataSize.push(data1);
            if (
              formValues.product_name != "" &&
              formValues.product_name != null
            ) {
              let str = formValues.product_name;
              let matches = str.match(/\b(\w)/g);
              acronym = matches.join("").toUpperCase();
              let lng = c.l;
              if (c.l.length == 1) {
                let lng = "0" + c.l;
              }
              let wgt = c.w;
              if (c.w.length == 1) {
                let wgt = "0" + c.w;
              }
              let hgt = c.hgt;
              if (c.h.length == 1) {
                let hgt = "0" + c.h;
              }
              let code = acronym + `${wgt}` + `${lng}` + `${hgt}`;
              prodCode.push(code);
            }
          } else if (newProduct.size_type == 3) {
            let data1 = `${c.l}`;
            dataSize.push(data1);
          }
        });
        // console.log('dataSize ===>',dataSize)
      }

      let reqData = {
        product_name: formValues.product_name,
        // product_code: formValues.product_code,
        // categories: formValues.categories,
        // color: newProduct.color,
        status: formValues.status,
        size_type: newProduct.size_type,
        size: dataSize,
      };
      // console.log(reqData)
      validateFormData(reqData);
    }
  };
  const validateFormData = (body) => {
    let schema = joi.object().keys({
      product_name: joi
        .string()
        .trim()
        .required(),
      // product_code: joi.string().trim().required(),
      // categories: joi.required(),
      // color: joi.array().items(joi.required()), //joi.required(),
      status: joi.required(),
      size_type: joi.required(),
      size: joi.array().items(joi.required()),
      // Joi.array().items(Joi.string())
    });
    joi.validate(body, schema, async (err, value) => {
      if (err) {
        // console.log(err)
        if (
          err.details[0].message !== error ||
          error.details[0].context.key !== errorField
        ) {
          let errorLog = validate(err);
          setError(errorLog.error);
          setErrorField(errorLog.errorField);
        }
      } else {
        setError("");
        setErrorField("");
        setIsLoading(true);
        let reqData = {};
        let ImageLink = "";
        if (formValues.file && formValues.file != "") {
          var bodyFormData = new FormData();
          bodyFormData.append("image", formValues.file);
          let res = await apiCall(
            "POST",
            "",
            "/admin/product/upload-image",
            bodyFormData
          );
          if (res.data) {
            if (res.data.code === 0) {
              displayLog(0, res.data.message);
            } else {
              ImageLink = res.data.data.image;
            }
          }
        }
        if (wantToEdit) {
          console.log("UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE");
          console.log(formValues);
          reqData = {
            product_name: formValues.product_name,
            // product_code: formValues.product_code ? formValues.product_code.toString() : '',
            product_code: await genCode(
              formValues.common_code,
              formValues.iscustomsize,
              formValues.iscustomsizexl
            ), //formValues.product_code, //prodCode.toString(),
            common_code: formValues.common_code,
            category: formValues.categories,
            style_bundle: newProduct.style_bundle,
            color: newProduct.color,
            status: formValues.status,
            size_type: newProduct.size_type,
            size: dataSize,
            // image: "",
            product_id: formValues._id,
            iscustomsize: formValues.iscustomsize == 1 ? 1 : 0,
            iscustomsizexl: formValues.iscustomsizexl == 1 ? 1 : 0,
          };
          if (formValues.file && formValues.file != "") {
            reqData["image"] = ImageLink;
          } else {
            reqData["image"] = formValues.image;
          }
          // console.log(reqData)
          // firebase.analytics().logEvent('notification_received');

          console.log("UPDATE DATA:", reqData);
          await updateProfession(context.setProfessions, reqData);
        } else {
          reqData = {
            product_name: formValues.product_name,
            product_code: await genCode(
              formValues.common_code,
              formValues.iscustomsize,
              formValues.iscustomsizexl
            ), //formValues.product_code, //prodCode.toString(),
            common_code: formValues.common_code,
            category: formValues.categories,
            style_bundle: newProduct.style_bundle,
            color: newProduct.color,
            status: formValues.status,
            size_type: newProduct.size_type,
            size: dataSize,
            image: ImageLink,
            iscustomsize: formValues.iscustomsize == 1 ? 1 : 0,
            iscustomsizexl: formValues.iscustomsizexl == 1 ? 1 : 0,
          };
          console.log(reqData);
          await createProfession(context.setProfessions, reqData);
        }
        await getProfessionsRequest(context.setProfessions);
        setToggleInputModal(false);
        setIsLoading(false);
        setSizeData([{ l: "", w: "", h: "" }]);
        setNewProduct({ ...newProduct, size: [] });
      }
    });
  };
  const genCommonCode = () => {
    const product_name = formValues.product_name,
      style_bundles = newProduct.style_bundle,
      size_type = newProduct.size_type,
      proCodes = [];
    if (product_name && size_type) {
      const SIZE_TYPES = ["WWLL", "WWLLHH"],
        STYLE_BUNDLES = ["S", "F", "QC", "BQC", "BEQ"],
        matches = product_name.match(/\b(\w)/g),
        acronym = matches.join("").toUpperCase();
      if (style_bundles && style_bundles.length > 0) {
        for (const style_bundle of style_bundles) {
          const acronym2 = style_bundle
              .match(/\b(\w)/g)
              .join("")
              .toUpperCase(),
            cd =
              acronym +
              SIZE_TYPES[Number(size_type) - 1] +
              STYLE_BUNDLES[Number(acronym2) - 1];
          proCodes.push(cd);
        }
      } else {
        const cd = acronym + SIZE_TYPES[Number(size_type) - 1];
        proCodes.push(cd);
      }

      setFormValues({ ...formValues, common_code: proCodes.toString() });
    }
  };
  const genCode = async (code, iscustomsize, iscustomsizexl) => {
    console.log("GENERATING NEW CODE");
    const SIZE_TYPES = ["WWLL", "WWLLHH"],
      size_type = SIZE_TYPES[Number(newProduct.size_type) - 1],
      sizes =
        newProduct.size && newProduct.size[0]
          ? newProduct.size
          : sizearr && sizearr[0]
          ? sizearr
          : [],
      codes = code.split(","),
      proCode = [];
    for (const c of codes) {
      for (const s of sizes) {
        let size = Object.values(s),
          proC = "";
        if (size_type == "WWLL") {
          size.pop();
        }
        if (c.search(size_type) >= 0) {
          proC = c.replace(
            size_type,
            size.reduce((a, s) => a + String(s).padStart(2, "0"), "")
          );
        } else {
          proC = c + size.reduce((a, s) => a + String(s).padStart(2, "0"), "");
        }
        proCode.push(proC);
      }

      if (iscustomsize == 1) {
        if (c.search(size_type) >= 0) {
          proCode.push(c.replace(size_type, "CUST"));
        } else {
          proCode.push(c + "CUST");
        }
      }
      if (iscustomsizexl == 1) {
        if (c.search(size_type) >= 0) {
          proCode.push(c.replace(size_type, "CUSTXL"));
        } else {
          proCode.push(c + "CUSTXL");
        }
      }
    }

    return proCode.toString();
  };

  console.log("SizeTypeee", newProduct.size_type);

  return (
    <Grid container spacing={3}>
      <span className={classes.mainPageTitle}>Product Management</span>
      <Grid item xs={12}>
        <Widget inheritHeight>
          <Box
            justifyContent={"space-between"}
            display={"flex"}
            alignItems={"center"}
          >
            <Box style={{ margin: "0 12px 0 0" }}>
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => manageModal(false)}
              >
                <Box mr={1} display={"flex"}>
                  <AddIcon />
                </Box>
                Add
              </Button>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"flex-end"}
            ></Box>
          </Box>
        </Widget>
      </Grid>
      {!context.professions.isLoaded || !professions.data ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100vw"}
          height={"calc(100vh - 200px)"}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table aria-labelledby="tableTitle" aria-label="enhanced table">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={professions.data.product.length}
                />
                {professions.data.product &&
                professions.data.product.length > 0 ? (
                  <TableBody>
                    {stableSort(
                      professions.data.product,
                      getComparator(order, orderBy)
                    )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <TableRow hover tabIndex={-1} key={index}>
                            <TableCell component="th" scope="row" align="left">
                              <Typography variant={"body2"}>
                                {page * rowsPerPage + index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row.product_name}
                                </Typography>
                              </Box>
                            </TableCell>
                            {/* <TableCell align="left">
                                                                <Box
                                                                    display={'flex'}
                                                                    alignItems={'center'}
                                                                >
                                                                    <Typography
                                                                        variant={'body2'}
                                                                    >
                                                                        {row.product_code}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell> */}
                            <TableCell align="left">
                              <Box display={"flex"} alignItems={"center"}>
                                <Typography variant={"body2"}>
                                  {row.size_type == 1
                                    ? "Width * Length"
                                    : row.size_type == 2
                                    ? "Width * Length * Height"
                                    : row.size_type == 3
                                    ? "Custom Size"
                                    : ""}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <Typography variant={"body2"}>
                                <Switch
                                  checked={row.status === 1 ? true : false}
                                  onChange={(e) => handleChange(e, row._id)}
                                  color="primary"
                                  name="checkedB"
                                  inputProps={{
                                    "aria-label": "primary checkbox",
                                  }}
                                />
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box display={"flex"} justifyContent={"center"}>
                                <IconButton
                                  color={"primary"}
                                  onClick={() => manageModal(true, row)}
                                >
                                  <CreateIcon />
                                </IconButton>
                                <IconButton
                                  color={"primary"}
                                  onClick={(e) =>
                                    deleteProfessionHandler(e, row._id)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={headCells.length}>
                        <Typography
                          style={{ textAlign: "center", padding: "10px 0px" }}
                          noWrap
                          variant={"h4"}
                        >
                          No Records
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={professions.data.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      )}
      <Dialog
        open={toggleInputModal}
        onClose={() => setToggleInputModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {wantToEdit ? "Edit" : "Add"} Product
        </DialogTitle>
        <DialogContent>
          <Input
            label="Product Name"
            placeholder={"Product Name"}
            margin="normal"
            variant="outlined"
            onChange={(e) =>
              setFormValues({
                ...formValues,
                product_name: e.target.value.replace(/^\s+/, ""),
              })
            }
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={formValues.product_name}
            fullWidth
          />
          {errorField === "product_name" && <ErrorMessage error={error} />}
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%", marginTop: "10px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Category"
              value={formValues.categories}
              onChange={handleChangeSelect}
            >
              {context.categoryList.categoryList.data &&
                context.categoryList.categoryList.data.map((c) => (
                  <MenuItem value={c._id} key={c._id}>
                    {c.category_name}
                  </MenuItem>
                ))}
            </Select>
            {errorField === "categories" && <ErrorMessage error={error} />}
          </FormControl>
          {formValues.categories === "3" || formValues.categories === "6" ? (
            <FormControl
              className={classes.formControl}
              style={{ width: "100%", marginTop: "10px", marginLeft: "5px" }}
            >
              <InputLabel id="demo-mutiple-name-label">Style Bundle</InputLabel>
              <Select
                labelId="demo-mutiple-name-label"
                id="demo-mutiple-name"
                multiple
                value={
                  formValues.style_bundle && newProduct.style_bundle.length == 0
                    ? JSON.parse(formValues.style_bundle)
                    : newProduct.style_bundle
                }
                onChange={(e) => handleChangeStyleBundle(e)}
                input={<Input2 />}
                MenuProps={MenuProps}
              >
                <MenuItem value={"1"}>Shell & Pad only</MenuItem>
                <MenuItem value={"2"}>Fixed complete</MenuItem>
                <MenuItem value={"3"}>Quick-release complete</MenuItem>
                <MenuItem value={"4"}>w/ BAC - Q/R complete</MenuItem>
                <MenuItem value={"5"}>
                  {" "}
                  w/ BAC & Expander cover - Q/R complete
                </MenuItem>
              </Select>
              {errorField === "color" && <ErrorMessage error={error} />}
            </FormControl>
          ) : null}
          <FormControl
            className={classes.formControl}
            style={{ width: "100%", marginTop: "10px", marginLeft: "5px" }}
          >
            <InputLabel id="demo-mutiple-name-label">Color</InputLabel>
            <Select
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              multiple
              value={
                formValues.color && newProduct.color.length == 0
                  ? JSON.parse(formValues.color)
                  : newProduct.color
              }
              onChange={(e) => handleChangeColor(e)}
              input={<Input2 />}
              MenuProps={MenuProps}
            >
              <MenuItem value={"#000000"}>Black</MenuItem>
              <MenuItem value={"#FFFFFF"}>White</MenuItem>
              <MenuItem value={"#0066FA"}>Blue</MenuItem>
              <MenuItem value={"#2CBF6D"}>Green</MenuItem>
              <MenuItem value={"#EFC663"}>Yellow</MenuItem>
              <MenuItem value={"#E16070"}>Red</MenuItem>
              <MenuItem value={"#9677DF"}>Purple</MenuItem>
              <MenuItem value={"#FFA500"}>Orange</MenuItem>
              <MenuItem value={"#FFC0CB"}>Pink</MenuItem>
            </Select>
            {errorField === "color" && <ErrorMessage error={error} />}
          </FormControl>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%", marginTop: "20px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Status
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Category"
              value={formValues.status}
              onChange={(e) =>
                setFormValues({ ...formValues, status: e.target.value })
              }
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Deactivated</MenuItem>
            </Select>
            {errorField === "status" && <ErrorMessage error={error} />}
          </FormControl>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            style={{ width: "100%", marginTop: "20px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Size Type
            </InputLabel>

            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Category"
              value={newProduct.size_type}
              onChange={(e) => handleChangeSize(e)}
            >
              <MenuItem value={"1"} onClick={() => addMoreLH(1)}>
                Width * Length
              </MenuItem>
              <MenuItem value={"2"} onClick={() => addMoreLH(1)}>
                Width * Length * Height
              </MenuItem>
            </Select>
            {errorField === "size_type" && <ErrorMessage error={error} />}
          </FormControl>
          <Input
            label="Product Code"
            placeholder={"Product Code"}
            margin="normal"
            variant="outlined"
            onChange={(e) => {
              setFormValues({
                ...formValues,
                common_code: e.target.value.replace(/^\s+/, ""),
              });
              setNewProduct({ ...newProduct });
            }}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            value={
              formValues.common_code
                ? formValues.common_code
                    .toString()
                    .replace(/ /g, "")
                    .replaceAll(",", ", ")
                : ""
            }
            // value={formValues.product_code}
            fullWidth
          />
          {errorField === "product_code" && <ErrorMessage error={error} />}

          {wantToEdit ? (
            newProduct.size_type == 1 || formValues.size_type == 1 ? (
              <div className={"sizeDiv"}>
                {console.log("sizearr====", sizearr)}
                {sizearr != null &&
                  sizearr.length > 0 &&
                  sizearr.map((c, i) => (
                    <>
                      <div className={"sizeDivField"}>
                        <div style={{ display: "flex" }}>
                          <Box width={100}>
                            <Input
                              name="w"
                              margin="normal"
                              className={classes.inputNumber}
                              min="1"
                              step="1"
                              placeholder="Width"
                              variant="outlined"
                              type="number"
                              value={c.w}
                              onChange={(e) => handleInputChange(e, i)}
                            />
                          </Box>
                          <Box width={100}>
                            <Input
                              name="l"
                              margin="normal"
                              className={classes.inputNumber}
                              min="1"
                              step="1"
                              placeholder="Length"
                              variant="outlined"
                              type="number"
                              value={c.l}
                              onChange={(e) => handleInputChange(e, i)}
                            />
                          </Box>
                        </div>
                      </div>
                      <div>
                        19
                        {sizearr.length - 1 === i && (
                          <Button onClick={() => handleAddClick()}>Add</Button>
                        )}
                        {sizearr.length !== 1 && (
                          <Button onClick={() => handleRemoveClick(i)}>
                            Remove
                          </Button>
                        )}
                      </div>
                    </>
                  ))}
              </div>
            ) : newProduct.size_type == 2 || formValues.size_type == 2 ? (
              <div className={"sizeDiv"}>
                {console.log("sizearr", sizearr)}
                {sizearr.map((c, i) => (
                  <>
                    <div className={"sizeDivField"}>
                      <div style={{ display: "flex" }}>
                        <Box width={100}>
                          <Input
                            name="w"
                            margin="normal"
                            placeholder="Width"
                            variant="outlined"
                            type="number"
                            value={c.w}
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </Box>
                        <Box width={100}>
                          <Input
                            name="l"
                            margin="normal"
                            placeholder="Length"
                            variant="outlined"
                            type="number"
                            value={c.l}
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </Box>
                        <Box width={100}>
                          <Input
                            name="h"
                            margin="normal"
                            placeholder="Height"
                            variant="outlined"
                            type="number"
                            value={c.h}
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </Box>
                      </div>
                    </div>

                    <div>
                      {sizearr.length - 1 === i && (
                        <Button onClick={() => handleAddClick()}>Add</Button>
                      )}
                      {sizearr.length !== 1 && (
                        <Button onClick={() => handleRemoveClick(i)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  </>
                ))}
              </div>
            ) : (
              <div></div>
            )
          ) : newProduct.size_type == 1 || formValues.size_type == 1 ? (
            <div className={"sizeDiv"}>
              {console.log("SIZEEE", sizeData)}
              {sizeData.map((c, i) => (
                <>
                  <div className={"sizeDivField"}>
                    <div style={{ display: "flex" }}>
                      <Box width={100}>
                        <Input
                          name="w"
                          margin="normal"
                          className={classes.inputNumber}
                          min="1"
                          step="1"
                          placeholder="Width"
                          variant="outlined"
                          type="number"
                          value={sizeData.w}
                          onChange={(e) => handleInputChange(e, i)}
                          required
                        />
                      </Box>
                      <Box width={100}>
                        <Input
                          name="l"
                          margin="normal"
                          className={classes.inputNumber}
                          min="1"
                          step="1"
                          placeholder="Length"
                          variant="outlined"
                          type="number"
                          value={sizeData.l}
                          onChange={(e) => handleInputChange(e, i)}
                          required
                        />
                      </Box>
                    </div>
                  </div>
                  <div>
                    {console.log("NEXTDATA LENGTH", sizeData.length)}
                    {sizeData.length - 1 === i && (
                      <Button onClick={() => handleAddClick()}>Add</Button>
                    )}
                    {sizeData.length !== 1 && (
                      <Button onClick={() => handleRemoveClick(i)}>
                        Remove
                      </Button>
                    )}
                  </div>
                </>
              ))}
            </div>
          ) : newProduct.size_type == 2 || formValues.size_type == 2 ? (
            <div className={"sizeDiv"}>
              {console.log("SIZEEE===", sizeData)}
              {sizeData.map((c, i) => (
                <>
                  <div className={"sizeDivField"}>
                    <div style={{ display: "flex" }}>
                      <Box width={100}>
                        <Input
                          name="w"
                          margin="normal"
                          placeholder="Width"
                          variant="outlined"
                          type="number"
                          value={sizeData.w}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </Box>
                      <Box width={100}>
                        <Input
                          name="l"
                          margin="normal"
                          placeholder="Length"
                          variant="outlined"
                          type="number"
                          value={sizeData.l}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </Box>
                      <Box width={100}>
                        <Input
                          name="h"
                          margin="normal"
                          placeholder="Height"
                          variant="outlined"
                          type="number"
                          value={sizeData.h}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </Box>
                    </div>
                  </div>

                  <div>
                    {sizeData.length - 1 === i && (
                      <Button onClick={() => handleAddClick()}>Add</Button>
                    )}
                    {sizeData.length !== 1 && (
                      <Button onClick={() => handleRemoveClick(i)}>
                        Remove
                      </Button>
                    )}
                  </div>
                </>
              ))}
            </div>
          ) : newProduct.size_type == 3 || formValues.size_type == 3 ? (
            <div className={"sizeDiv"}>
              {sizeData.map((c, i) => (
                <>
                  <div className={"sizeDivField"}>
                    <div style={{ display: "flex" }}>
                      <Box width={100}>
                        <Input
                          name="l"
                          margin="normal"
                          placeholder="Add Custom Size"
                          variant="outlined"
                          value={sizeData.l}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </Box>
                    </div>
                  </div>
                  <div>
                    {sizeData.length !== 1 && (
                      <Button onClick={() => handleRemoveClick(i)}>
                        Remove
                      </Button>
                    )}
                    {sizeData.length - 1 === i && (
                      <Button onClick={() => handleAddClick()}>Add</Button>
                    )}
                  </div>
                </>
              ))}
            </div>
          ) : (
            <div></div>
          )}
          {errorField === "size" && <ErrorMessage error={error} />}
          <div></div>
          <FormControlLabel
            className={classes.input}
            style={{ marginTop: "10px" }}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            control={
              <Checkbox
                checked={formValues.iscustomsize == 1 ? true : false}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    iscustomsize: e.target.checked,
                  })
                }
                name="checkedB"
                color="primary"
              />
            }
            label="Allow Custom Size"
          />
          <div></div>
          <FormControlLabel
            className={classes.input}
            style={{ marginTop: "10px" }}
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
            control={
              <Checkbox
                checked={formValues.iscustomsizexl == 1 ? true : false}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    iscustomsizexl: e.target.checked,
                  })
                }
                name="checkedB"
                color="primary"
              />
            }
            label="Allow Custom XL Size"
          />
          <div></div>
          <InputLabel
            id="demo-simple-select-outlined-label"
            style={{ marginTop: "20px", float: "left", marginRight: "5px" }}
          >
            Image
          </InputLabel>
          <input
            style={{ marginTop: "20px", marginLeft: "5px", float: "none" }}
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            type="file"
            name="file"
            onChange={(e) =>
              setFormValues({ ...formValues, file: e.target.files[0] })
            }
            margin="normal"
            variant="outlined"
            InputProps={{
              classes: {
                underline: classes.InputUnderline,
                input: classes.Input,
              },
            }}
          />
          <div></div>
          {wantToEdit && formValues.image != "" ? (
            <img
              src={formValues.image}
              style={{
                height: "100px",
                width: "100px",
                marginTop: "20px",
                borderRadius: "20px",
              }}
            />
          ) : (
            <div></div>
          )}
        </DialogContent>
        <DialogActions style={{ padding: "10px 24px 20px" }}>
          <Button
            variant={"outlined"}
            color="primary"
            onClick={() => setToggleInputModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={"contained"}
            color="primary"
            onClick={submitProfessionHandler}
            disabled={isLoading}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Professions;
