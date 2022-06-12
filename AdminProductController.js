const Messages = require('../../services/message');
var Common = require('../CommonController');
var CategoryModel = require('../../models/Category');
var ProductModel = require('../../models/Product');

exports.GetAllCategory = (req, res, next) => {
    CategoryModel.GetAppCategory(req.body.search).then(result => {
        Common.sendresponse(res, 200, true, Messages.category_get_success, result.rows);
    }).catch(err => {
        Common.sendresponse(res, 200, false, err.message);
    });
}

/* add product */
exports.AddProduct = (req, res, next) => {
    ProductModel.CheckProductExist(req.body.product_name, req.body.category)
        .then(result => {
            if (result.rows.length > 0) {
                Common.sendresponse(res, 400, false, Messages.product_already_exist);
            }
            else {
                ProductModel.GetProductCode(req.body.product_code).then(result => {
                    if (result.rows.length > 0) {
                        Common.sendresponse(res, 400, false, Messages.product_code_error);
                    } else {
                        ProductModel.SaveProduct(req.body.product_name, req.body.category, req.body.size, req.body.color, req.body.status, req.body.product_code, req.body.image, req.body.size_type, req.body.iscustomsize, req.body.iscustomsizexl, req.body.style_bundle).then(result => {
                            Common.sendresponse(res, 200, true, Messages.product_success);
                        }).catch(err => {
                            Common.sendresponse(res, 400, false, err.message);
                        });
                    }
                }).catch(err => {
                    Common.sendresponse(res, 400, false, err.message);
                });
            }
            /*})
            ProductModel.GetProductCode(req.body.product_code).then(result => {
                if(result.rows.length > 0){
                    Common.sendresponse(res,400,false,Messages.product_code_error);
                }else{
                    ProductModel.SaveProduct(req.body.product_name,req.body.category, req.body.size, req.body.color, req.body.status, req.body.product_code, req.body.image, req.body.size_type, req.body.iscustomsize, req.body.iscustomsizexl).then(result =>{
                        Common.sendresponse(res,200,true,Messages.product_success);
                    }).catch(err => {
                        Common.sendresponse(res,400,false,err.message);
                    });
                }*/
        }).catch(err => {
            Common.sendresponse(res, 400, false, err.message);
        });
}

/*update product */
exports.UpdateProduct = (req, res, next) => {
    ProductModel.CheckProductExist(req.body.product_name, req.body.category, req.body.product_id)
        .then(result => {
            if (result.rows.length > 0) {
                Common.sendresponse(res, 400, false, Messages.product_already_exist);
            }
            else {
                ProductModel.GetProductCode(req.body.product_code).then(getProductCode => {
                    if (getProductCode.rows.length > 0 && getProductCode.rows[0]._id != req.body.product_id) {
                        Common.sendresponse(res, 400, false, Messages.product_code_error);
                    } else {
                        ProductModel.UpdateProduct(req.body.product_name, req.body.category, req.body.size, req.body.color, req.body.status, req.body.product_code, req.body.image, req.body.size_type, req.body.product_id, req.body.iscustomsize, req.body.iscustomsizexl, req.body.style_bundle).then(result => {
                            Common.sendresponse(res, 200, true, Messages.product_update_success);
                        }).catch(err => {
                            Common.sendresponse(res, 400, false, err.message);
                        });
                    }
                }).catch(err => {
                    Common.sendresponse(res, 400, false, err.message);
                });
            }
        }).catch(err => {
            Common.sendresponse(res, 400, false, err.message);
        });
}

/* update status */
exports.ChangeStatus = (req, res, next) => {
    ProductModel.UpdateStatus(req.body.status, req.body.product_id).then(UpdateStatus => {
        Common.sendresponse(res, 200, true, Messages.product_status_success);
    }).catch(err => {
        Common.sendresponse(res, 400, false, err.message);
    });
}

/* delete product */
exports.DeleteProduct = (req, res, next) => {
    ProductModel.DeleteProduct(req.params.product_id).then(result => {
        Common.sendresponse(res, 200, true, Messages.product_delete_success);
    }).catch(err => {
        Common.sendresponse(res, 400, false, err.message);
    });
}

/* Product List */
exports.ProductList = (req, res, next) => {
    ProductModel.GetProduct(req).then(result => {
        Common.sendresponse(res, 200, true, Messages.get_product_list, result);
    }).catch(err => {
        Common.sendresponse(res, 400, false, err.message);
    });
}

/* get all Product List */
exports.GetProductList = (req, res, next) => {
    ProductModel.ProductGetList().then(result => {
        Common.sendresponse(res, 200, true, Messages.get_product_list, result.rows);
    }).catch(err => {
        Common.sendresponse(res, 400, false, err.message);
    });
}

/* Product details by id */
exports.ProductDetails = (req, res, next) => {
    ProductModel.GetProductId(req.body.product_id).then(result => {
        result.rows[0].size = JSON.parse(result.rows[0].size);
        result.rows[0].color = JSON.parse(result.rows[0].color);
        Common.sendresponse(res, 200, true, Messages.get_product_details, result.rows[0]);
    }).catch(err => {
        Common.sendresponse(res, 400, false, err.message);
    });
}