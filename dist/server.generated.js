/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./centralSystem.js":
/*!**************************!*\
  !*** ./centralSystem.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createServer\": () => (/* binding */ createServer)\n/* harmony export */ });\n/* harmony import */ var _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ocpp/src/index.js */ \"./ocpp/src/index.js\");\n/* harmony import */ var _ocpp_src_commands_Authorize_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ocpp/src/commands/Authorize.js */ \"./ocpp/src/commands/Authorize.js\");\n/* harmony import */ var _ocpp_src_commands_StartTransaction_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ocpp/src/commands/StartTransaction.js */ \"./ocpp/src/commands/StartTransaction.js\");\n/* harmony import */ var _ocpp_src_ocppError_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ocpp/src/ocppError.js */ \"./ocpp/src/ocppError.js\");\n/* harmony import */ var _ocpp_src_commands_BootNotification_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ocpp/src/commands/BootNotification.js */ \"./ocpp/src/commands/BootNotification.js\");\n/* harmony import */ var _ocpp_src_commands_StatusNotification_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ocpp/src/commands/StatusNotification.js */ \"./ocpp/src/commands/StatusNotification.js\");\n/* harmony import */ var _models_chargerPoint_model_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./models/chargerPoint.model.js */ \"./models/chargerPoint.model.js\");\n/* harmony import */ var _models_transaction_model_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./models/transaction.model.js */ \"./models/transaction.model.js\");\n/* harmony import */ var _controllers_user_controller_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./controllers/user.controller.js */ \"./controllers/user.controller.js\");\n\n\n\n\n\n\n\n\n\nconst getCPData = payload => {\n  return {\n    charge_point_vendor: payload.chargePointVendor || '',\n    charge_point_model: payload.chargePointModel || '',\n    charge_point_serial_number: payload.chargePointSerialNumber || '',\n    charge_box_serial_number: payload.chargeBoxSerialNumber || '',\n    fw_version: payload.firmwareVersion || '',\n    iccid: payload.iccid || '',\n    imsi: payload.imsi || '',\n    meter_type: payload.meterType || '',\n    meter_serial_number: payload.meterSerialNumber || '',\n    registration_status: 'Accepted'\n  };\n};\nconst concatenate = (command, client) => {\n  const ui = Math.round(Date.now() + Math.random());\n  const connectorIdx = client.info.connectors.findIndex(item => {\n    return command.connectorId === item.connectorId;\n  });\n  const uid = '' + ui + client.info.connectors[connectorIdx].connectorId;\n  if (connectorIdx === -1) {\n    client.info.connectors.push({});\n  } else {\n    client.info.connectors[connectorIdx] = {\n      ...client.info.connectors[connectorIdx],\n      ...{\n        transactionId: uid\n      }\n    };\n    return uid;\n  }\n};\nfunction createServer(server) {\n  const cSystem = new _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__.CentralSystem({\n    validateConnection,\n    wsOptions: {\n      server\n    }\n  });\n  cSystem.listen(null);\n  cSystem.onStatusUpdate = async function () {};\n  cSystem.onRequest = async function (client, command) {\n    const connection = client.connection;\n    console.info(`New command from ${connection.url}`);\n    switch (true) {\n      case command instanceof _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.BootNotification:\n        client.info = {\n          connectors: [],\n          ...command\n        };\n        let chargerPoint = await _models_chargerPoint_model_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"].findOne({\n          charger_box_id: connection.url.substring(1)\n        });\n        if (!chargerPoint) {\n          console.info('ChargerPoint does not exist in DB');\n          return {\n            status: _ocpp_src_commands_BootNotification_js__WEBPACK_IMPORTED_MODULE_4__.STATUS_REJECTED,\n            currentTime: new Date().toISOString(),\n            interval: 30\n          };\n        }\n        await _models_chargerPoint_model_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"].findByIdAndUpdate(chargerPoint._id, getCPData(command));\n        return {\n          status: _ocpp_src_commands_BootNotification_js__WEBPACK_IMPORTED_MODULE_4__.STATUS_ACCEPTED,\n          currentTime: new Date().toISOString(),\n          interval: 100\n        };\n      case command instanceof _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.Authorize:\n        return {\n          idTagInfo: {\n            status: _ocpp_src_commands_Authorize_js__WEBPACK_IMPORTED_MODULE_1__.STATUS_ACCEPTED\n          }\n        };\n      case command instanceof _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.MeterValues:\n        const connectorIdx = client.info.connectors.findIndex(item => {\n          return command.connectorId === item.connectorId;\n        });\n        if (connectorIdx === -1) {\n          client.info.connectors.push({});\n        } else {\n          client.info.connectors[connectorIdx] = {\n            ...client.info.connectors[connectorIdx],\n            ...command.meterValue[0].sampledValue[0]\n          };\n        }\n        await cSystem.onStatusUpdate();\n        return {};\n      case command instanceof _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.StartTransaction:\n        // const uid = concatenate(command, client);\n\n        //  await cSystem.onStatusUpdate();\n\n        return {\n          transactionId: 1,\n          idTagInfo: {\n            status: _ocpp_src_commands_StartTransaction_js__WEBPACK_IMPORTED_MODULE_2__.STATUS_ACCEPTED\n          }\n        };\n      case command instanceof _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.StopTransaction:\n        return {\n          transactionId: 1,\n          idTagInfo: {\n            status: _ocpp_src_commands_StartTransaction_js__WEBPACK_IMPORTED_MODULE_2__.STATUS_ACCEPTED\n          }\n        };\n      case command instanceof _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.Heartbeat:\n        return {\n          currentTime: new Date().toISOString()\n        };\n      case command instanceof _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.StatusNotification:\n        // client.info = client.info || {};\n        // client.info.connectors = client.info.connectors || [];\n\n        const connectorIndex = client.info.connectors.findIndex(item => {\n          return command.connectorId === item.connectorId;\n        });\n        if (connectorIndex === -1) {\n          client.info.connectors.push({\n            ...command\n          });\n        } else {\n          client.info.connectors[connectorIndex] = {\n            ...command\n          };\n        }\n        await cSystem.onStatusUpdate();\n        return {};\n      default:\n        throw new _ocpp_src_ocppError_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"](_ocpp_src_ocppError_js__WEBPACK_IMPORTED_MODULE_3__.ERROR_NOTIMPLEMENTED, 'Unknown command');\n    }\n  };\n  cSystem.toggleChargePoint = async (client, connectorId, user, transactionId) => {\n    const connector = client.info.connectors.find(item => connectorId.toString() === item.connectorId.toString());\n    if (!connector) {\n      return null;\n    }\n    if (connector.status !== _ocpp_src_commands_StatusNotification_js__WEBPACK_IMPORTED_MODULE_5__.STATUS_AVAILABLE) {\n      let command = new _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.RemoteStopTransaction({\n        transactionId: connectorId\n      });\n      await client.connection.send(command);\n      return;\n    }\n    let command = new _ocpp_src_index_js__WEBPACK_IMPORTED_MODULE_0__.OCPPCommands.RemoteStartTransaction({\n      connectorId: connectorId,\n      idTag: '' + user\n    });\n    await client.connection.send(command);\n  };\n  return cSystem;\n  async function validateConnection(url) {\n    let chargerPoint = await _models_chargerPoint_model_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"].findOne({\n      charger_box_id: url.substring(1)\n    });\n    if (chargerPoint) {\n      return true;\n    }\n    return false;\n  }\n}\nfunction timeout(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n\n//# sourceURL=webpack://epp/./centralSystem.js?");

/***/ }),

/***/ "./config/config.js":
/*!**************************!*\
  !*** ./config/config.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst config = {\n  env: \"development\" || 0,\n  port: process.env.PORT || 3000,\n  jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',\n  mongoUri: process.env.MONGODB_URI || process.env.MONGO_HOST || 'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/ocpp'\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);\n\n//# sourceURL=webpack://epp/./config/config.js?");

/***/ }),

/***/ "./controllers/auth.controller.js":
/*!****************************************!*\
  !*** ./controllers/auth.controller.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_user_model_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user.model.js */ \"./models/user.model.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var express_jwt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-jwt */ \"express-jwt\");\n/* harmony import */ var express_jwt__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_jwt__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _config_config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/config.js */ \"./config/config.js\");\n\n\n\n\nconst signin = async (req, res) => {\n  try {\n    let user = await _models_user_model_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne({\n      email: req.body.email\n    });\n    if (!user) return res.status('401').json({\n      error: 'User not found'\n    });\n    if (!user.authenticate(req.body.password)) {\n      return res.status('401').send({\n        error: \"Email and password don't match.\"\n      });\n    }\n    const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign({\n      _id: user._id\n    }, _config_config_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].jwtSecret);\n    res.cookie('t', token, {\n      expire: new Date() + 9999\n    });\n    return res.json({\n      token,\n      user: {\n        _id: user._id,\n        name: user.name,\n        email: user.email\n      }\n    });\n  } catch (err) {\n    return res.status('401').json({\n      error: 'Could not sign in'\n    });\n  }\n};\nconst signout = (req, res) => {\n  res.clearCookie('t');\n  return res.status('200').json({\n    message: 'signed out'\n  });\n};\nconst requireSignin = express_jwt__WEBPACK_IMPORTED_MODULE_2___default()({\n  secret: _config_config_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].jwtSecret,\n  userProperty: 'auth',\n  algorithms: ['sha1', 'RS256', 'HS256']\n});\nconst hasAuthorization = (req, res, next) => {\n  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;\n  if (!authorized) {\n    return res.status('403').json({\n      error: 'User is not authorized'\n    });\n  }\n  next();\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  signin,\n  signout,\n  requireSignin,\n  hasAuthorization\n});\n\n//# sourceURL=webpack://epp/./controllers/auth.controller.js?");

/***/ }),

/***/ "./controllers/chargerPoint.controller.js":
/*!************************************************!*\
  !*** ./controllers/chargerPoint.controller.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_chargerPoint_model_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/chargerPoint.model.js */ \"./models/chargerPoint.model.js\");\n/* harmony import */ var lodash_extend_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/extend.js */ \"lodash/extend.js\");\n/* harmony import */ var lodash_extend_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_extend_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/dbErrorHandler.js */ \"./helpers/dbErrorHandler.js\");\n/* harmony import */ var _server_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../server.js */ \"./server.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nconst create = async (req, res) => {\n  const chargerPoint = new _models_chargerPoint_model_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](req.body);\n  try {\n    await chargerPoint.save();\n    return res.status(200).json({\n      message: 'Charger Point Successfully created!'\n    });\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst list = async (req, res) => {\n  try {\n    let chargerPoints = await _models_chargerPoint_model_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find();\n    res.json(chargerPoints);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst chargerPointByID = async (req, res, next, id) => {\n  try {\n    let chargerPoint = await _models_chargerPoint_model_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findById(id);\n    console.log(chargerPoint);\n    if (!chargerPoint) return res.status('400').json({\n      error: 'ChargerPoint not found'\n    });\n    req.cp = chargerPoint;\n    next();\n  } catch (err) {\n    return res.status('400').json({\n      error: 'Could not retrieve chargerPoint'\n    });\n  }\n};\nconst read = async (req, res) => {\n  // console.log(req)\n  try {\n    let chargerPoint = await _models_chargerPoint_model_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne({\n      charger_box_id: req.params.station\n    });\n    if (!chargerPoint) return res.status('400').json({\n      error: 'ChargerPoint not found'\n    });\n    res.json(chargerPoint);\n  } catch (err) {\n    return res.status('400').json({\n      error: 'Could not retrieve chargerPoint'\n    });\n  }\n};\nconst update = async (req, res) => {\n  try {\n    let chargerPoint = req.cp;\n    chargerPoint = lodash_extend_js__WEBPACK_IMPORTED_MODULE_1___default()(chargerPoint, req.body);\n    chargerPoint.updated = Date.now();\n    await chargerPoint.save();\n    res.json(chargerPoint);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst remoteStart = async (req, res) => {\n  const idf = lodash__WEBPACK_IMPORTED_MODULE_4___default().findIndex(_server_js__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients, function (o) {\n    return o.connection.req.url === `${req.body.id}`;\n  });\n  if (idf !== -1) {\n    await _server_js__WEBPACK_IMPORTED_MODULE_3__.centralSystem.toggleChargePoint(_server_js__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients[idf], parseInt(req.body.connector), req.profile.id_tag\n    //req.body.transactionId\n    );\n\n    res.write(JSON.stringify({}));\n  }\n  res.end();\n  return;\n};\nconst remove = async (req, res) => {\n  try {\n    let chargerPoint = req.cp;\n    let deleteCP = await chargerPoint.remove();\n    deleteCP.hashed_password = undefined;\n    deleteCP.salt = undefined;\n    res.json(deleteCP);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst clients = async (req, res) => {\n  try {\n    const getClients = _server_js__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients.map(client => client.connection.req.url);\n    res.json(getClients);\n  } catch (error) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst status = async (req, res) => {\n  res.setHeader('Content-Type', 'text/event-stream');\n  res.setHeader('Access-Control-Allow-Origin', '*');\n  onDigits(req, res);\n  _server_js__WEBPACK_IMPORTED_MODULE_3__.centralSystem.onStatusUpdate = () => onDigits(req, res);\n};\nfunction onDigits(req, res) {\n  const intervalId = setInterval(() => {\n    const data = _server_js__WEBPACK_IMPORTED_MODULE_3__.centralSystem.clients.map(client => {\n      return {\n        id: client.connection.req.url,\n        ...client.info\n      };\n    });\n    res.write(`data: ${JSON.stringify(data)}\\n\\n`);\n  }, 1000);\n  res.on('close', () => {\n    clearInterval(intervalId);\n    res.end();\n  });\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  create,\n  chargerPointByID,\n  read,\n  list,\n  remove,\n  update,\n  status,\n  clients,\n  remoteStart\n});\n\n//# sourceURL=webpack://epp/./controllers/chargerPoint.controller.js?");

/***/ }),

/***/ "./controllers/user.controller.js":
/*!****************************************!*\
  !*** ./controllers/user.controller.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_user_model_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user.model.js */ \"./models/user.model.js\");\n/* harmony import */ var lodash_extend_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/extend.js */ \"lodash/extend.js\");\n/* harmony import */ var lodash_extend_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_extend_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/dbErrorHandler.js */ \"./helpers/dbErrorHandler.js\");\n\n\n\nconst create = async (req, res) => {\n  const user = new _models_user_model_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](req.body);\n  try {\n    await user.save();\n    return res.status(200).json({\n      message: 'Successfully signed up!'\n    });\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst list = async (req, res) => {\n  try {\n    let users = await _models_user_model_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find().select('name email updated created');\n    res.json(users);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst userByID = async (req, res, next, id) => {\n  try {\n    let user = await _models_user_model_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findById(id);\n    if (!user) return res.status('400').json({\n      error: 'User not found'\n    });\n    req.profile = user;\n    next();\n  } catch (err) {\n    return res.status('400').json({\n      error: 'Could not retrieve user'\n    });\n  }\n};\nconst read = (req, res) => {\n  req.profile.hashed_password = undefined;\n  req.profile.salt = undefined;\n  return res.json(req.profile);\n};\nconst update = async (req, res) => {\n  try {\n    let user = req.profile;\n    user = lodash_extend_js__WEBPACK_IMPORTED_MODULE_1___default()(user, req.body);\n    user.updated = Date.now();\n    await user.save();\n    user.hashed_password = undefined;\n    user.salt = undefined;\n    res.json(user);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst remove = async (req, res) => {\n  try {\n    let user = req.profile;\n    let deletedUser = await user.remove();\n    deletedUser.hashed_password = undefined;\n    deletedUser.salt = undefined;\n    res.json(deletedUser);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  create,\n  userByID,\n  read,\n  list,\n  remove,\n  update\n});\n\n//# sourceURL=webpack://epp/./controllers/user.controller.js?");

/***/ }),

/***/ "./express.js":
/*!********************!*\
  !*** ./express.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\n/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cookie_parser__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! helmet */ \"helmet\");\n/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(helmet__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _routes_user_routes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./routes/user.routes.js */ \"./routes/user.routes.js\");\n/* harmony import */ var _routes_auth_routes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./routes/auth.routes.js */ \"./routes/auth.routes.js\");\n/* harmony import */ var _routes_chargerPoint_routes_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./routes/chargerPoint.routes.js */ \"./routes/chargerPoint.routes.js\");\n/* harmony import */ var _sse_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./sse.js */ \"./sse.js\");\n\n\n\n\n\n\n\n\nconst app = express__WEBPACK_IMPORTED_MODULE_0___default()();\n/*... configure express ... */\n\napp.use(express__WEBPACK_IMPORTED_MODULE_0___default().json());\napp.use(express__WEBPACK_IMPORTED_MODULE_0___default().urlencoded({\n  extended: true\n}));\napp.use(cookie_parser__WEBPACK_IMPORTED_MODULE_1___default()());\n//app.use(compress());\napp.use(helmet__WEBPACK_IMPORTED_MODULE_3___default()());\napp.use(cors__WEBPACK_IMPORTED_MODULE_2___default()());\napp.use(_sse_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"]);\napp.use('/', _routes_user_routes_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"]);\napp.use('/', _routes_auth_routes_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"]);\napp.use('/', _routes_chargerPoint_routes_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"]);\napp.use((err, req, res, next) => {\n  if (err.name === 'UnauthorizedError') {\n    res.status(401).json({\n      error: err.name + ': ' + err.message\n    });\n  } else if (err) {\n    res.status(400).json({\n      error: err.name + ': ' + err.message\n    });\n    console.log(err);\n  }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);\n\n//# sourceURL=webpack://epp/./express.js?");

/***/ }),

/***/ "./helpers/dbErrorHandler.js":
/*!***********************************!*\
  !*** ./helpers/dbErrorHandler.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n\n/**\n * Get unique error field name\n */\nconst getUniqueErrorMessage = err => {\n  let output;\n  try {\n    let fieldName = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'));\n    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';\n  } catch (ex) {\n    output = 'Unique field already exists';\n  }\n  return output;\n};\n\n/**\n * Get the error message from error object\n */\nconst getErrorMessage = err => {\n  let message = '';\n  if (err.code) {\n    switch (err.code) {\n      case 11000:\n      case 11001:\n        message = getUniqueErrorMessage(err);\n        break;\n      default:\n        message = 'Something went wrong';\n    }\n  } else {\n    for (let errName in err.errors) {\n      if (err.errors[errName].message) message = err.errors[errName].message;\n    }\n  }\n  return message;\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  getErrorMessage\n});\n\n//# sourceURL=webpack://epp/./helpers/dbErrorHandler.js?");

/***/ }),

/***/ "./models/chargerPoint.model.js":
/*!**************************************!*\
  !*** ./models/chargerPoint.model.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst Schema = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema);\nconst ChargerPointSchema = new Schema({\n  charger_box_id: {\n    type: String,\n    required: true\n  },\n  ocpp_protocol: {\n    type: String,\n    required: false\n  },\n  registration_status: {\n    type: String,\n    required: false\n  },\n  charge_point_vendor: {\n    type: String,\n    required: false\n  },\n  charger_point_model: {\n    type: String,\n    required: false\n  },\n  charger_point_serial_number: {\n    type: String,\n    required: false\n  },\n  charger_box_serial_number: {\n    type: String,\n    required: false\n  },\n  fw_version: {\n    type: String,\n    required: false\n  },\n  fw_update_status: {\n    type: String,\n    required: false\n  },\n  fw_update_timestamp: {\n    type: Date,\n    required: false\n  },\n  meter_type: {\n    type: String,\n    required: false\n  },\n  meter_serial_number: {\n    type: String,\n    required: false\n  },\n  diagnostics_status: {\n    type: String,\n    required: false\n  },\n  diagnostics_timestamp: {\n    type: Date,\n    required: false\n  },\n  last_heartbeat_timestamp: {\n    type: Date,\n    required: false\n  },\n  iccid: {\n    type: String,\n    required: false\n  },\n  imsi: {\n    type: String,\n    required: false\n  },\n  description: {\n    type: String,\n    required: false\n  },\n  note: {\n    type: String,\n    required: false\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  },\n  updated: Date\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('ChargerPoint', ChargerPointSchema));\n\n//# sourceURL=webpack://epp/./models/chargerPoint.model.js?");

/***/ }),

/***/ "./models/transaction.model.js":
/*!*************************************!*\
  !*** ./models/transaction.model.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst Schema = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema);\nconst TransactionSchema = new Schema({\n  charger_box_id: {\n    type: String,\n    required: true\n  },\n  connector: {\n    type: Number,\n    required: true\n  },\n  start_timestamp: {\n    type: Date,\n    required: true\n  },\n  start_value: {\n    type: Number,\n    required: true\n  },\n  stop_timestamp: {\n    type: Date,\n    required: true\n  },\n  stop_value: {\n    type: Number,\n    required: true\n  },\n  event: {\n    type: String,\n    required: true\n  },\n  postedBy: {\n    type: (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema.ObjectId),\n    ref: 'User'\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  },\n  updated: Date\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('Transaction', TransactionSchema));\n\n//# sourceURL=webpack://epp/./models/transaction.model.js?");

/***/ }),

/***/ "./models/user.model.js":
/*!******************************!*\
  !*** ./models/user.model.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst Schema = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema);\nconst UserSchema = new Schema({\n  name: {\n    type: String,\n    trim: true,\n    required: 'Name is required'\n  },\n  email: {\n    type: String,\n    trim: true,\n    unique: 'Email already exists',\n    match: [/.+\\@.+\\..+/, 'Please fill a valid email address'],\n    required: 'Email is required'\n  },\n  hashed_password: {\n    type: String,\n    required: 'Password is required'\n  },\n  about: {\n    type: String,\n    trim: true\n  },\n  photo: {\n    data: Buffer,\n    contentType: String\n  },\n  id_tag: {\n    type: String,\n    required: true\n  },\n  salt: String,\n  created: {\n    type: Date,\n    default: Date.now\n  },\n  updated: Date\n});\nUserSchema.virtual('password').set(function (password) {\n  this._password = password;\n  this.salt = this.makeSalt();\n  this.hashed_password = this.encryptPassword(password);\n}).get(function () {\n  return this._password;\n});\nUserSchema.methods = {\n  authenticate: function (plainText) {\n    return this.encryptPassword(plainText) === this.hashed_password;\n  },\n  encryptPassword: function (password) {\n    if (!password) return '';\n    try {\n      return crypto__WEBPACK_IMPORTED_MODULE_1___default().createHmac('sha1', this.salt).update(password).digest('hex');\n    } catch (err) {\n      return '';\n    }\n  },\n  makeSalt: function () {\n    return Math.round(new Date().valueOf() * Math.random()) + '';\n  }\n};\nUserSchema.path('hashed_password').validate(function (v) {\n  if (this._password && this._password.length < 6) {\n    this.invalidate('password', 'Password must be at least 6 characters.');\n  }\n  if (this.isNew && !this._password) {\n    this.invalidate('password', 'Password is required');\n  }\n}, null);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('User', UserSchema));\n\n//# sourceURL=webpack://epp/./models/user.model.js?");

/***/ }),

/***/ "./ocpp/src/centralSystem.js":
/*!***********************************!*\
  !*** ./ocpp/src/centralSystem.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ CentralSystem)\n/* harmony export */ });\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logger.js */ \"./ocpp/src/logger.js\");\n/* harmony import */ var _connection_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./connection.js */ \"./ocpp/src/connection.js\");\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants.js */ \"./ocpp/src/constants.js\");\n/* harmony import */ var _centralSystemClient_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./centralSystemClient.js */ \"./ocpp/src/centralSystemClient.js\");\n\n\n\n\n\n\nconst debug = debug__WEBPACK_IMPORTED_MODULE_1___default()(_constants_js__WEBPACK_IMPORTED_MODULE_4__.DEBUG_LIBNAME);\nclass CentralSystem {\n  constructor(options) {\n    this.options = options || {};\n    this.clients = [];\n    this.logger = new _logger_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]();\n  }\n  listen(port = 9220, host = null) {\n    this.port = port;\n    const validateConnection = this.options.validateConnection || (() => true);\n    const wsOptions = {\n      port,\n      host,\n      handleProtocols: (protocols, req) => {\n        let newProtocols;\n        if (typeof protocols === 'object') {\n          newProtocols = Array.from(protocols);\n        } else {\n          newProtocols = protocols;\n        }\n        if (newProtocols.indexOf(_constants_js__WEBPACK_IMPORTED_MODULE_4__.OCPP_PROTOCOL_1_6) === -1) {\n          return '';\n        }\n        return _constants_js__WEBPACK_IMPORTED_MODULE_4__.OCPP_PROTOCOL_1_6;\n      },\n      verifyClient: async (info, cb) => {\n        if (info.req.url === _logger_js__WEBPACK_IMPORTED_MODULE_2__.LOGGER_URL) {\n          debug('Logger connected');\n          return cb(true);\n        }\n        const isAccept = await validateConnection(info.req.url);\n        this.logger.debug(`Request for connect \"${info.req.url}\" (${info.req.headers['sec-websocket-protocol']}) - ${isAccept ? 'Valid identifier' : 'Invalid identifier'}`);\n        cb(isAccept, 404, 'Central System does not recognize the charge point identifier in the URL path');\n      },\n      ...(this.options.wsOptions || {})\n    };\n    console.log('%ccentralSystem.js line:59 wsOptions', 'color: #007acc;', wsOptions);\n    this.server = new (ws__WEBPACK_IMPORTED_MODULE_0___default().Server)(wsOptions);\n    console.log('%ccentralSystem.js line:61 this.server', 'color: #007acc;', this.server);\n    this.server.on('error', (ws, req) => {\n      console.info(ws, req);\n    });\n    this.server.on('upgrade', (ws, req) => {\n      console.info(req);\n    });\n    this.server.on('connection', (ws, req) => this.onNewConnection(ws, req));\n    console.log('%ccentralSystem.js line:72 object', 'color: #007acc;', `Listen on ${host || 'default host'}:${port}`);\n    debug(`Listen on ${host || 'default host'}:${port}`);\n  }\n  onNewConnection(socket, req) {\n    socket.on('error', err => {\n      console.info(err, socket.readyState);\n    });\n    if (req.url === _logger_js__WEBPACK_IMPORTED_MODULE_2__.LOGGER_URL) {\n      this.logger.addSocket(socket);\n      return;\n    }\n    if (!socket.protocol) {\n      // From Spec: If the Central System does not agree to using one of the subprotocols offered by the client,\n      // it MUST complete the WebSocket handshake with a response without a Sec-WebSocket-Protocol header and then\n      // immediately close the WebSocket connection.\n      this.logger.debug(`Close connection due to unsupported protocol`);\n      return socket.close();\n    }\n    const connection = new _connection_js__WEBPACK_IMPORTED_MODULE_3__.Connection(socket, req, this.logger);\n    const client = new _centralSystemClient_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"](connection);\n    connection.onRequest = command => this.onRequest(client, command);\n    socket.on('close', err => {\n      const index = this.clients.indexOf(client);\n      this.clients.splice(index, 1);\n    });\n    this.clients.push(client);\n  }\n  async onRequest(client, command) {\n    // implementation\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/centralSystem.js?");

/***/ }),

/***/ "./ocpp/src/centralSystemClient.js":
/*!*****************************************!*\
  !*** ./ocpp/src/centralSystemClient.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ CentralSystemClient)\n/* harmony export */ });\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _connection_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./connection.js */ \"./ocpp/src/connection.js\");\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.js */ \"./ocpp/src/constants.js\");\n\n\n\n\nconst debug = debug__WEBPACK_IMPORTED_MODULE_1___default()(_constants_js__WEBPACK_IMPORTED_MODULE_3__.DEBUG_LIBNAME);\nclass CentralSystemClient {\n  constructor(connection) {\n    this.connection = connection;\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/centralSystemClient.js?");

/***/ }),

/***/ "./ocpp/src/chargePoint.js":
/*!*********************************!*\
  !*** ./ocpp/src/chargePoint.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ChargePoint)\n/* harmony export */ });\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _commands_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./commands/index.js */ \"./ocpp/src/commands/index.js\");\n/* harmony import */ var _connection_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./connection.js */ \"./ocpp/src/connection.js\");\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants.js */ \"./ocpp/src/constants.js\");\n\n\n\n\n\nconst debug = debug__WEBPACK_IMPORTED_MODULE_1___default()(_constants_js__WEBPACK_IMPORTED_MODULE_4__.DEBUG_LIBNAME);\nclass ChargePoint {\n  /**\n   * Create OCPP client\n   *\n   * @param {Object} options Configuration options\n   * @param {String} options.centralSystemUrl The url where to connect\n   * @param {String} options.reconnectInterval The number of milliseconds to delay before attempting to reconnect (default: 5 minutes)\n   * @param {String} options.connectors Array of virtual connectors\n   */\n  constructor(options) {\n    options.connectors = options.connectors || [];\n    this.options = options;\n  }\n  connect() {\n    debug(`Try connect to ${this.options.centralSystemUrl}`);\n    let reconnectTimer;\n    const reconnectInterval = this.options.reconnectInterval || 5 * 60 * 1000; // 5 minutes\n    const self = this;\n    return new Promise((resolve, reject) => {\n      const ws = new (ws__WEBPACK_IMPORTED_MODULE_0___default())(this.options.centralSystemUrl, [_constants_js__WEBPACK_IMPORTED_MODULE_4__.OCPP_PROTOCOL_1_6], {\n        perMessageDeflate: false,\n        protocolVersion: 13\n      });\n      ws.on('upgrade', res => {\n        if (!res.headers['sec-websocket-protocol']) {\n          return reject(new Error(`Server doesn't support protocol ${_constants_js__WEBPACK_IMPORTED_MODULE_4__.OCPP_PROTOCOL_1_6}`));\n        }\n      });\n      ws.on('close', () => {\n        debug(`Connection is closed`);\n        this.connection = null;\n        nextReconnectAttempt();\n      });\n      ws.on('open', () => {\n        ws.removeAllListeners('error');\n        this.connection = new _connection_js__WEBPACK_IMPORTED_MODULE_3__.Connection(ws);\n        this.connection.onRequest = command => this.onRequest(command);\n        resolve(this.connection);\n      });\n      ws.on('error', reject);\n    });\n    function nextReconnectAttempt() {\n      if (reconnectTimer) {\n        clearInterval(reconnectTimer);\n        reconnectTimer = null;\n      }\n      reconnectTimer = setTimeout(async () => {\n        try {\n          await self.connect();\n        } catch (err) {}\n      }, reconnectInterval);\n    }\n  }\n  send(command) {\n    if (!this.connection) {\n      return false;\n    }\n    return this.connection.send(command);\n  }\n  onRequest(command) {}\n  getConnectors() {\n    return this.options.connectors;\n  }\n  async sendCurrentStatus() {\n    const promises = this.getConnectors().map(async connector => {\n      const status = {\n        timestamp: new Date().toISOString(),\n        ...connector\n      };\n      const statusCommand = new _commands_index_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].StatusNotification(status);\n      await this.send(statusCommand);\n    });\n    return await Promise.all(promises);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/chargePoint.js?");

/***/ }),

/***/ "./ocpp/src/commands/Authorize.js":
/*!****************************************!*\
  !*** ./ocpp/src/commands/Authorize.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Authorize\": () => (/* binding */ Authorize),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_BLOCKED\": () => (/* binding */ STATUS_BLOCKED),\n/* harmony export */   \"STATUS_CONCURRENTTX\": () => (/* binding */ STATUS_CONCURRENTTX),\n/* harmony export */   \"STATUS_EXPIRED\": () => (/* binding */ STATUS_EXPIRED),\n/* harmony export */   \"STATUS_INVALID\": () => (/* binding */ STATUS_INVALID)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_Authorize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/Authorize */ \"./ocpp/ocpp-1.6-schemas/Authorize.json\");\n/* harmony import */ var _ocpp_1_6_schemas_AuthorizeResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/AuthorizeResponse */ \"./ocpp/ocpp-1.6-schemas/AuthorizeResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_BLOCKED = 'Blocked';\nconst STATUS_EXPIRED = 'Expired';\nconst STATUS_INVALID = 'Invalid';\nconst STATUS_CONCURRENTTX = 'ConcurrentTx';\nclass Authorize extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_Authorize__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_AuthorizeResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/Authorize.js?");

/***/ }),

/***/ "./ocpp/src/commands/BaseCommand.js":
/*!******************************************!*\
  !*** ./ocpp/src/commands/BaseCommand.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ BaseCommand)\n/* harmony export */ });\n/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers.js */ \"./ocpp/src/helpers.js\");\n\nconst RESPONSE_SCHEMA_SYMBOL = Symbol('responseSchema');\nclass BaseCommand {\n  constructor(requestSchema, responseSchema, values) {\n    this[RESPONSE_SCHEMA_SYMBOL] = responseSchema;\n    (0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.applyPropertiesValidators)(this, requestSchema, values);\n  }\n  getCommandName() {\n    return this.constructor.name;\n  }\n  createResponse(payload) {\n    const response = new function () {}();\n    (0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.applyPropertiesValidators)(response, this[RESPONSE_SCHEMA_SYMBOL], payload);\n    return response;\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/BaseCommand.js?");

/***/ }),

/***/ "./ocpp/src/commands/BootNotification.js":
/*!***********************************************!*\
  !*** ./ocpp/src/commands/BootNotification.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BootNotification\": () => (/* binding */ BootNotification),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_PENDING\": () => (/* binding */ STATUS_PENDING),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_BootNotification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/BootNotification */ \"./ocpp/ocpp-1.6-schemas/BootNotification.json\");\n/* harmony import */ var _ocpp_1_6_schemas_BootNotificationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/BootNotificationResponse */ \"./ocpp/ocpp-1.6-schemas/BootNotificationResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_PENDING = 'Pending';\nconst STATUS_REJECTED = 'Rejected';\nclass BootNotification extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_BootNotification__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_BootNotificationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/BootNotification.js?");

/***/ }),

/***/ "./ocpp/src/commands/CancelReservation.js":
/*!************************************************!*\
  !*** ./ocpp/src/commands/CancelReservation.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CancelReservation\": () => (/* binding */ CancelReservation),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_CancelReservation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/CancelReservation */ \"./ocpp/ocpp-1.6-schemas/CancelReservation.json\");\n/* harmony import */ var _ocpp_1_6_schemas_CancelReservationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/CancelReservationResponse */ \"./ocpp/ocpp-1.6-schemas/CancelReservationResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass CancelReservation extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_CancelReservation__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_CancelReservationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/CancelReservation.js?");

/***/ }),

/***/ "./ocpp/src/commands/ChangeAvailability.js":
/*!*************************************************!*\
  !*** ./ocpp/src/commands/ChangeAvailability.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ChangeAvailability\": () => (/* binding */ ChangeAvailability),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"STATUS_SCHEDULED\": () => (/* binding */ STATUS_SCHEDULED),\n/* harmony export */   \"TYPE_INOPERATIVE\": () => (/* binding */ TYPE_INOPERATIVE),\n/* harmony export */   \"TYPE_OPERATIVE\": () => (/* binding */ TYPE_OPERATIVE)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_ChangeAvailability__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ChangeAvailability */ \"./ocpp/ocpp-1.6-schemas/ChangeAvailability.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ChangeAvailabilityResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ChangeAvailabilityResponse */ \"./ocpp/ocpp-1.6-schemas/ChangeAvailabilityResponse.json\");\n\n\n\nconst TYPE_INOPERATIVE = 'Inoperative';\nconst TYPE_OPERATIVE = 'Operative';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nconst STATUS_SCHEDULED = 'Scheduled';\nclass ChangeAvailability extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_ChangeAvailability__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ChangeAvailabilityResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/ChangeAvailability.js?");

/***/ }),

/***/ "./ocpp/src/commands/ChangeConfiguration.js":
/*!**************************************************!*\
  !*** ./ocpp/src/commands/ChangeConfiguration.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ChangeConfiguration\": () => (/* binding */ ChangeConfiguration),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_NOTSUPPORTED\": () => (/* binding */ STATUS_NOTSUPPORTED),\n/* harmony export */   \"STATUS_REBOOTREQUIRED\": () => (/* binding */ STATUS_REBOOTREQUIRED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_ChangeConfiguration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ChangeConfiguration */ \"./ocpp/ocpp-1.6-schemas/ChangeConfiguration.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ChangeConfigurationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ChangeConfigurationResponse */ \"./ocpp/ocpp-1.6-schemas/ChangeConfigurationResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nconst STATUS_REBOOTREQUIRED = 'RebootRequired';\nconst STATUS_NOTSUPPORTED = 'NotSupported';\nclass ChangeConfiguration extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_ChangeConfiguration__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ChangeConfigurationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/ChangeConfiguration.js?");

/***/ }),

/***/ "./ocpp/src/commands/ClearCache.js":
/*!*****************************************!*\
  !*** ./ocpp/src/commands/ClearCache.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ClearCache\": () => (/* binding */ ClearCache),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_ClearCache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ClearCache */ \"./ocpp/ocpp-1.6-schemas/ClearCache.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ClearCacheResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ClearCacheResponse */ \"./ocpp/ocpp-1.6-schemas/ClearCacheResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass ClearCache extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_ClearCache__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ClearCacheResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/ClearCache.js?");

/***/ }),

/***/ "./ocpp/src/commands/ClearChargingProfile.js":
/*!***************************************************!*\
  !*** ./ocpp/src/commands/ClearChargingProfile.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXPROFILE),\n/* harmony export */   \"ClearChargingProfile\": () => (/* binding */ ClearChargingProfile),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_UNKNOWN\": () => (/* binding */ STATUS_UNKNOWN)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_ClearChargingProfile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ClearChargingProfile */ \"./ocpp/ocpp-1.6-schemas/ClearChargingProfile.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ClearChargingProfileResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ClearChargingProfileResponse */ \"./ocpp/ocpp-1.6-schemas/ClearChargingProfileResponse.json\");\n\n\n\nconst CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE = 'ChargePointMaxProfile';\nconst CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE = 'TxDefaultProfile';\nconst CHARGING_PROFILE_PURPOSE_TXPROFILE = 'TxProfile';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_UNKNOWN = 'Unknown';\nclass ClearChargingProfile extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_ClearChargingProfile__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ClearChargingProfileResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/ClearChargingProfile.js?");

/***/ }),

/***/ "./ocpp/src/commands/DataTransfer.js":
/*!*******************************************!*\
  !*** ./ocpp/src/commands/DataTransfer.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DataTransfer\": () => (/* binding */ DataTransfer),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"STATUS_UNKNOWNMESSAGEID\": () => (/* binding */ STATUS_UNKNOWNMESSAGEID),\n/* harmony export */   \"STATUS_UNKNOWNVENDORID\": () => (/* binding */ STATUS_UNKNOWNVENDORID)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_DataTransfer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/DataTransfer */ \"./ocpp/ocpp-1.6-schemas/DataTransfer.json\");\n/* harmony import */ var _ocpp_1_6_schemas_DataTransferResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/DataTransferResponse */ \"./ocpp/ocpp-1.6-schemas/DataTransferResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nconst STATUS_UNKNOWNMESSAGEID = 'UnknownMessageId';\nconst STATUS_UNKNOWNVENDORID = 'UnknownVendorId';\nclass DataTransfer extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_DataTransfer__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_DataTransferResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/DataTransfer.js?");

/***/ }),

/***/ "./ocpp/src/commands/DiagnosticsStatusNotification.js":
/*!************************************************************!*\
  !*** ./ocpp/src/commands/DiagnosticsStatusNotification.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DiagnosticsStatusNotification\": () => (/* binding */ DiagnosticsStatusNotification),\n/* harmony export */   \"STATUS_IDLE\": () => (/* binding */ STATUS_IDLE),\n/* harmony export */   \"STATUS_UPLOADED\": () => (/* binding */ STATUS_UPLOADED),\n/* harmony export */   \"STATUS_UPLOADFAILED\": () => (/* binding */ STATUS_UPLOADFAILED),\n/* harmony export */   \"STATUS_UPLOADING\": () => (/* binding */ STATUS_UPLOADING)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_DiagnosticsStatusNotification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/DiagnosticsStatusNotification */ \"./ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotification.json\");\n/* harmony import */ var _ocpp_1_6_schemas_DiagnosticsStatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse */ \"./ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse.json\");\n\n\n\nconst STATUS_IDLE = 'Idle';\nconst STATUS_UPLOADED = 'Uploaded';\nconst STATUS_UPLOADFAILED = 'UploadFailed';\nconst STATUS_UPLOADING = 'Uploading';\nclass DiagnosticsStatusNotification extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_DiagnosticsStatusNotification__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_DiagnosticsStatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/DiagnosticsStatusNotification.js?");

/***/ }),

/***/ "./ocpp/src/commands/FirmwareStatusNotification.js":
/*!*********************************************************!*\
  !*** ./ocpp/src/commands/FirmwareStatusNotification.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"FirmwareStatusNotification\": () => (/* binding */ FirmwareStatusNotification),\n/* harmony export */   \"STATUS_DOWNLOADED\": () => (/* binding */ STATUS_DOWNLOADED),\n/* harmony export */   \"STATUS_DOWNLOADFAILED\": () => (/* binding */ STATUS_DOWNLOADFAILED),\n/* harmony export */   \"STATUS_DOWNLOADING\": () => (/* binding */ STATUS_DOWNLOADING),\n/* harmony export */   \"STATUS_IDLE\": () => (/* binding */ STATUS_IDLE),\n/* harmony export */   \"STATUS_INSTALLATIONFAILED\": () => (/* binding */ STATUS_INSTALLATIONFAILED),\n/* harmony export */   \"STATUS_INSTALLED\": () => (/* binding */ STATUS_INSTALLED),\n/* harmony export */   \"STATUS_INSTALLING\": () => (/* binding */ STATUS_INSTALLING)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_FirmwareStatusNotification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/FirmwareStatusNotification */ \"./ocpp/ocpp-1.6-schemas/FirmwareStatusNotification.json\");\n/* harmony import */ var _ocpp_1_6_schemas_FirmwareStatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/FirmwareStatusNotificationResponse */ \"./ocpp/ocpp-1.6-schemas/FirmwareStatusNotificationResponse.json\");\n\n\n\nconst STATUS_DOWNLOADED = 'Downloaded';\nconst STATUS_DOWNLOADFAILED = 'DownloadFailed';\nconst STATUS_DOWNLOADING = 'Downloading';\nconst STATUS_IDLE = 'Idle';\nconst STATUS_INSTALLATIONFAILED = 'InstallationFailed';\nconst STATUS_INSTALLING = 'Installing';\nconst STATUS_INSTALLED = 'Installed';\nclass FirmwareStatusNotification extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_FirmwareStatusNotification__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_FirmwareStatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/FirmwareStatusNotification.js?");

/***/ }),

/***/ "./ocpp/src/commands/GetCompositeSchedule.js":
/*!***************************************************!*\
  !*** ./ocpp/src/commands/GetCompositeSchedule.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CHARGING_RATE_UNIT_A\": () => (/* binding */ CHARGING_RATE_UNIT_A),\n/* harmony export */   \"CHARGING_RATE_UNIT_W\": () => (/* binding */ CHARGING_RATE_UNIT_W),\n/* harmony export */   \"GetCompositeSchedule\": () => (/* binding */ GetCompositeSchedule),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_GetCompositeSchedule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetCompositeSchedule */ \"./ocpp/ocpp-1.6-schemas/GetCompositeSchedule.json\");\n/* harmony import */ var _ocpp_1_6_schemas_GetCompositeScheduleResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetCompositeScheduleResponse */ \"./ocpp/ocpp-1.6-schemas/GetCompositeScheduleResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nconst CHARGING_RATE_UNIT_A = 'A';\nconst CHARGING_RATE_UNIT_W = 'W';\nclass GetCompositeSchedule extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_GetCompositeSchedule__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_GetCompositeScheduleResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/GetCompositeSchedule.js?");

/***/ }),

/***/ "./ocpp/src/commands/GetConfiguration.js":
/*!***********************************************!*\
  !*** ./ocpp/src/commands/GetConfiguration.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GetConfiguration\": () => (/* binding */ GetConfiguration)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_GetConfiguration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetConfiguration */ \"./ocpp/ocpp-1.6-schemas/GetConfiguration.json\");\n/* harmony import */ var _ocpp_1_6_schemas_GetConfigurationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetConfigurationResponse */ \"./ocpp/ocpp-1.6-schemas/GetConfigurationResponse.json\");\n\n\n\nclass GetConfiguration extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_GetConfiguration__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_GetConfigurationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/GetConfiguration.js?");

/***/ }),

/***/ "./ocpp/src/commands/GetDiagnostics.js":
/*!*********************************************!*\
  !*** ./ocpp/src/commands/GetDiagnostics.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GetDiagnostics\": () => (/* binding */ GetDiagnostics)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_GetDiagnostics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetDiagnostics */ \"./ocpp/ocpp-1.6-schemas/GetDiagnostics.json\");\n/* harmony import */ var _ocpp_1_6_schemas_GetDiagnosticsResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetDiagnosticsResponse */ \"./ocpp/ocpp-1.6-schemas/GetDiagnosticsResponse.json\");\n\n\n\nclass GetDiagnostics extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_GetDiagnostics__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_GetDiagnosticsResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/GetDiagnostics.js?");

/***/ }),

/***/ "./ocpp/src/commands/GetLocalListVersion.js":
/*!**************************************************!*\
  !*** ./ocpp/src/commands/GetLocalListVersion.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GetLocalListVersion\": () => (/* binding */ GetLocalListVersion)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_GetLocalListVersion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetLocalListVersion */ \"./ocpp/ocpp-1.6-schemas/GetLocalListVersion.json\");\n/* harmony import */ var _ocpp_1_6_schemas_GetLocalListVersionResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/GetLocalListVersionResponse */ \"./ocpp/ocpp-1.6-schemas/GetLocalListVersionResponse.json\");\n\n\n\nclass GetLocalListVersion extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_GetLocalListVersion__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_GetLocalListVersionResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/GetLocalListVersion.js?");

/***/ }),

/***/ "./ocpp/src/commands/Heartbeat.js":
/*!****************************************!*\
  !*** ./ocpp/src/commands/Heartbeat.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Heartbeat\": () => (/* binding */ Heartbeat)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_Heartbeat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/Heartbeat */ \"./ocpp/ocpp-1.6-schemas/Heartbeat.json\");\n/* harmony import */ var _ocpp_1_6_schemas_HeartbeatResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/HeartbeatResponse */ \"./ocpp/ocpp-1.6-schemas/HeartbeatResponse.json\");\n\n\n\nclass Heartbeat extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_Heartbeat__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_HeartbeatResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/Heartbeat.js?");

/***/ }),

/***/ "./ocpp/src/commands/MeterValues.js":
/*!******************************************!*\
  !*** ./ocpp/src/commands/MeterValues.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CONTEXT_DEAUTHORIZED\": () => (/* binding */ CONTEXT_DEAUTHORIZED),\n/* harmony export */   \"CONTEXT_INTERRUPTION_BEGIN\": () => (/* binding */ CONTEXT_INTERRUPTION_BEGIN),\n/* harmony export */   \"CONTEXT_INTERRUPTION_END\": () => (/* binding */ CONTEXT_INTERRUPTION_END),\n/* harmony export */   \"CONTEXT_OTHER\": () => (/* binding */ CONTEXT_OTHER),\n/* harmony export */   \"CONTEXT_SAMPLE_CLOCK\": () => (/* binding */ CONTEXT_SAMPLE_CLOCK),\n/* harmony export */   \"CONTEXT_SAMPLE_PERIODIC\": () => (/* binding */ CONTEXT_SAMPLE_PERIODIC),\n/* harmony export */   \"CONTEXT_TRANSACTION_BEGIN\": () => (/* binding */ CONTEXT_TRANSACTION_BEGIN),\n/* harmony export */   \"CONTEXT_TRANSACTION_END\": () => (/* binding */ CONTEXT_TRANSACTION_END),\n/* harmony export */   \"CONTEXT_TRIGGER\": () => (/* binding */ CONTEXT_TRIGGER),\n/* harmony export */   \"FORMAT_RAW\": () => (/* binding */ FORMAT_RAW),\n/* harmony export */   \"FORMAT_SIGNEDDATA\": () => (/* binding */ FORMAT_SIGNEDDATA),\n/* harmony export */   \"LOCATION_BODY\": () => (/* binding */ LOCATION_BODY),\n/* harmony export */   \"LOCATION_CABLE\": () => (/* binding */ LOCATION_CABLE),\n/* harmony export */   \"LOCATION_EV\": () => (/* binding */ LOCATION_EV),\n/* harmony export */   \"LOCATION_INLET\": () => (/* binding */ LOCATION_INLET),\n/* harmony export */   \"LOCATION_OUTLET\": () => (/* binding */ LOCATION_OUTLET),\n/* harmony export */   \"MEASURAND_CURRENT_EXPORT\": () => (/* binding */ MEASURAND_CURRENT_EXPORT),\n/* harmony export */   \"MEASURAND_CURRENT_IMPORT\": () => (/* binding */ MEASURAND_CURRENT_IMPORT),\n/* harmony export */   \"MEASURAND_CURRENT_OFFERED\": () => (/* binding */ MEASURAND_CURRENT_OFFERED),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER),\n/* harmony export */   \"MEASURAND_FREQUENCY\": () => (/* binding */ MEASURAND_FREQUENCY),\n/* harmony export */   \"MEASURAND_POWER_ACTIVE_EXPORT\": () => (/* binding */ MEASURAND_POWER_ACTIVE_EXPORT),\n/* harmony export */   \"MEASURAND_POWER_ACTIVE_IMPORT\": () => (/* binding */ MEASURAND_POWER_ACTIVE_IMPORT),\n/* harmony export */   \"MEASURAND_POWER_FACTOR\": () => (/* binding */ MEASURAND_POWER_FACTOR),\n/* harmony export */   \"MEASURAND_POWER_OFFERED\": () => (/* binding */ MEASURAND_POWER_OFFERED),\n/* harmony export */   \"MEASURAND_POWER_REACTIVE_EXPORT\": () => (/* binding */ MEASURAND_POWER_REACTIVE_EXPORT),\n/* harmony export */   \"MEASURAND_POWER_REACTIVE_IMPORT\": () => (/* binding */ MEASURAND_POWER_REACTIVE_IMPORT),\n/* harmony export */   \"MEASURAND_RPM\": () => (/* binding */ MEASURAND_RPM),\n/* harmony export */   \"MEASURAND_SOC\": () => (/* binding */ MEASURAND_SOC),\n/* harmony export */   \"MEASURAND_TEMPERATURE\": () => (/* binding */ MEASURAND_TEMPERATURE),\n/* harmony export */   \"MEASURAND_VOLTAGE\": () => (/* binding */ MEASURAND_VOLTAGE),\n/* harmony export */   \"MeterValues\": () => (/* binding */ MeterValues),\n/* harmony export */   \"PHASE_L1\": () => (/* binding */ PHASE_L1),\n/* harmony export */   \"PHASE_L1_L2\": () => (/* binding */ PHASE_L1_L2),\n/* harmony export */   \"PHASE_L1_N\": () => (/* binding */ PHASE_L1_N),\n/* harmony export */   \"PHASE_L2\": () => (/* binding */ PHASE_L2),\n/* harmony export */   \"PHASE_L2_L3\": () => (/* binding */ PHASE_L2_L3),\n/* harmony export */   \"PHASE_L2_N\": () => (/* binding */ PHASE_L2_N),\n/* harmony export */   \"PHASE_L3\": () => (/* binding */ PHASE_L3),\n/* harmony export */   \"PHASE_L3_L1\": () => (/* binding */ PHASE_L3_L1),\n/* harmony export */   \"PHASE_L3_N\": () => (/* binding */ PHASE_L3_N),\n/* harmony export */   \"PHASE_N\": () => (/* binding */ PHASE_N),\n/* harmony export */   \"UNIT_A\": () => (/* binding */ UNIT_A),\n/* harmony export */   \"UNIT_CELCIUS\": () => (/* binding */ UNIT_CELCIUS),\n/* harmony export */   \"UNIT_FAHRENHEIT\": () => (/* binding */ UNIT_FAHRENHEIT),\n/* harmony export */   \"UNIT_K\": () => (/* binding */ UNIT_K),\n/* harmony export */   \"UNIT_KVA\": () => (/* binding */ UNIT_KVA),\n/* harmony export */   \"UNIT_KVAR\": () => (/* binding */ UNIT_KVAR),\n/* harmony export */   \"UNIT_KVARH\": () => (/* binding */ UNIT_KVARH),\n/* harmony export */   \"UNIT_KW\": () => (/* binding */ UNIT_KW),\n/* harmony export */   \"UNIT_KWH\": () => (/* binding */ UNIT_KWH),\n/* harmony export */   \"UNIT_PERCENT\": () => (/* binding */ UNIT_PERCENT),\n/* harmony export */   \"UNIT_V\": () => (/* binding */ UNIT_V),\n/* harmony export */   \"UNIT_VA\": () => (/* binding */ UNIT_VA),\n/* harmony export */   \"UNIT_VAR\": () => (/* binding */ UNIT_VAR),\n/* harmony export */   \"UNIT_VARH\": () => (/* binding */ UNIT_VARH),\n/* harmony export */   \"UNIT_W\": () => (/* binding */ UNIT_W),\n/* harmony export */   \"UNIT_WH\": () => (/* binding */ UNIT_WH)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_MeterValues__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/MeterValues */ \"./ocpp/ocpp-1.6-schemas/MeterValues.json\");\n/* harmony import */ var _ocpp_1_6_schemas_MeterValuesResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/MeterValuesResponse */ \"./ocpp/ocpp-1.6-schemas/MeterValuesResponse.json\");\n\n\n\nconst CONTEXT_DEAUTHORIZED = 'DeAuthorized';\nconst CONTEXT_INTERRUPTION_BEGIN = 'Interruption.Begin';\nconst CONTEXT_INTERRUPTION_END = 'Interruption.End';\nconst CONTEXT_SAMPLE_CLOCK = 'Sample.Clock';\nconst CONTEXT_SAMPLE_PERIODIC = 'Sample.Periodic';\nconst CONTEXT_TRANSACTION_BEGIN = 'Transaction.Begin';\nconst CONTEXT_TRANSACTION_END = 'Transaction.End';\nconst CONTEXT_TRIGGER = 'Trigger';\nconst CONTEXT_OTHER = 'Other';\nconst FORMAT_RAW = 'Raw';\nconst FORMAT_SIGNEDDATA = 'SignedData';\nconst MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER = 'Energy.Active.Export.Register';\nconst MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER = 'Energy.Active.Import.Register';\nconst MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER = 'Energy.Reactive.Export.Register';\nconst MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER = 'Energy.Reactive.Import.Register';\nconst MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL = 'Energy.Active.Export.Interval';\nconst MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL = 'Energy.Active.Import.Interval';\nconst MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL = 'Energy.Reactive.Export.Interval';\nconst MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL = 'Energy.Reactive.Import.Interval';\nconst MEASURAND_POWER_ACTIVE_EXPORT = 'Power.Active.Export';\nconst MEASURAND_POWER_ACTIVE_IMPORT = 'Power.Active.Import';\nconst MEASURAND_POWER_OFFERED = 'Power.Offered';\nconst MEASURAND_POWER_REACTIVE_EXPORT = 'Power.Reactive.Export';\nconst MEASURAND_POWER_REACTIVE_IMPORT = 'Power.Reactive.Import';\nconst MEASURAND_POWER_FACTOR = 'Power.Factor';\nconst MEASURAND_CURRENT_IMPORT = 'Current.Import';\nconst MEASURAND_CURRENT_EXPORT = 'Current.Export';\nconst MEASURAND_CURRENT_OFFERED = 'Current.Offered';\nconst MEASURAND_VOLTAGE = 'Voltage';\nconst MEASURAND_FREQUENCY = 'Frequency';\nconst MEASURAND_TEMPERATURE = 'Temperature';\nconst MEASURAND_SOC = 'SoC';\nconst MEASURAND_RPM = 'RPM';\nconst PHASE_L1 = 'L1';\nconst PHASE_L2 = 'L2';\nconst PHASE_L3 = 'L3';\nconst PHASE_N = 'N';\nconst PHASE_L1_N = 'L1-N';\nconst PHASE_L2_N = 'L2-N';\nconst PHASE_L3_N = 'L3-N';\nconst PHASE_L1_L2 = 'L1-L2';\nconst PHASE_L2_L3 = 'L2-L3';\nconst PHASE_L3_L1 = 'L3-L1';\nconst LOCATION_CABLE = 'Cable';\nconst LOCATION_EV = 'EV';\nconst LOCATION_INLET = 'Inlet';\nconst LOCATION_OUTLET = 'Outlet';\nconst LOCATION_BODY = 'Body';\nconst UNIT_WH = 'Wh';\nconst UNIT_KWH = 'kWh';\nconst UNIT_VARH = 'varh';\nconst UNIT_KVARH = 'kvarh';\nconst UNIT_W = 'W';\nconst UNIT_KW = 'kW';\nconst UNIT_VA = 'VA';\nconst UNIT_KVA = 'kVA';\nconst UNIT_VAR = 'var';\nconst UNIT_KVAR = 'kvar';\nconst UNIT_A = 'A';\nconst UNIT_V = 'V';\nconst UNIT_K = 'K';\nconst UNIT_CELCIUS = 'Celcius';\nconst UNIT_FAHRENHEIT = 'Fahrenheit';\nconst UNIT_PERCENT = 'Percent';\nclass MeterValues extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_MeterValues__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_MeterValuesResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/MeterValues.js?");

/***/ }),

/***/ "./ocpp/src/commands/RemoteStartTransaction.js":
/*!*****************************************************!*\
  !*** ./ocpp/src/commands/RemoteStartTransaction.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CHARGING_PROFILE_KIND_ABSOLUTE\": () => (/* binding */ CHARGING_PROFILE_KIND_ABSOLUTE),\n/* harmony export */   \"CHARGING_PROFILE_KIND_RECURRING\": () => (/* binding */ CHARGING_PROFILE_KIND_RECURRING),\n/* harmony export */   \"CHARGING_PROFILE_KIND_RELATIVE\": () => (/* binding */ CHARGING_PROFILE_KIND_RELATIVE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXPROFILE),\n/* harmony export */   \"CHARGING_RATE_UNIT_A\": () => (/* binding */ CHARGING_RATE_UNIT_A),\n/* harmony export */   \"CHARGING_RATE_UNIT_W\": () => (/* binding */ CHARGING_RATE_UNIT_W),\n/* harmony export */   \"RECURRENCY_KIND_DAILY\": () => (/* binding */ RECURRENCY_KIND_DAILY),\n/* harmony export */   \"RECURRENCY_KIND_WEEKLY\": () => (/* binding */ RECURRENCY_KIND_WEEKLY),\n/* harmony export */   \"RemoteStartTransaction\": () => (/* binding */ RemoteStartTransaction),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_RemoteStartTransaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/RemoteStartTransaction */ \"./ocpp/ocpp-1.6-schemas/RemoteStartTransaction.json\");\n/* harmony import */ var _ocpp_1_6_schemas_RemoteStartTransactionResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/RemoteStartTransactionResponse */ \"./ocpp/ocpp-1.6-schemas/RemoteStartTransactionResponse.json\");\n\n\n\nconst CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE = 'ChargePointMaxProfile';\nconst CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE = 'TxDefaultProfile';\nconst CHARGING_PROFILE_PURPOSE_TXPROFILE = 'TxProfile';\nconst CHARGING_PROFILE_KIND_ABSOLUTE = 'Absolute';\nconst CHARGING_PROFILE_KIND_RECURRING = 'Recurring';\nconst CHARGING_PROFILE_KIND_RELATIVE = 'Relative';\nconst RECURRENCY_KIND_DAILY = 'Daily';\nconst RECURRENCY_KIND_WEEKLY = 'Weekly';\nconst CHARGING_RATE_UNIT_A = 'A';\nconst CHARGING_RATE_UNIT_W = 'W';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass RemoteStartTransaction extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_RemoteStartTransaction__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_RemoteStartTransactionResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/RemoteStartTransaction.js?");

/***/ }),

/***/ "./ocpp/src/commands/RemoteStopTransaction.js":
/*!****************************************************!*\
  !*** ./ocpp/src/commands/RemoteStopTransaction.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"RemoteStopTransaction\": () => (/* binding */ RemoteStopTransaction),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_RemoteStopTransaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/RemoteStopTransaction */ \"./ocpp/ocpp-1.6-schemas/RemoteStopTransaction.json\");\n/* harmony import */ var _ocpp_1_6_schemas_RemoteStopTransactionResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/RemoteStopTransactionResponse */ \"./ocpp/ocpp-1.6-schemas/RemoteStopTransactionResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass RemoteStopTransaction extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_RemoteStopTransaction__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_RemoteStopTransactionResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/RemoteStopTransaction.js?");

/***/ }),

/***/ "./ocpp/src/commands/ReserveNow.js":
/*!*****************************************!*\
  !*** ./ocpp/src/commands/ReserveNow.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ReserveNow\": () => (/* binding */ ReserveNow),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_FAULTED\": () => (/* binding */ STATUS_FAULTED),\n/* harmony export */   \"STATUS_OCCUPIED\": () => (/* binding */ STATUS_OCCUPIED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"STATUS_UNAVAILABLE\": () => (/* binding */ STATUS_UNAVAILABLE)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_ReserveNow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ReserveNow */ \"./ocpp/ocpp-1.6-schemas/ReserveNow.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ReserveNowResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ReserveNowResponse */ \"./ocpp/ocpp-1.6-schemas/ReserveNowResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_FAULTED = 'Faulted';\nconst STATUS_OCCUPIED = 'Occupied';\nconst STATUS_REJECTED = 'Rejected';\nconst STATUS_UNAVAILABLE = 'Unavailable';\nclass ReserveNow extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_ReserveNow__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ReserveNowResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/ReserveNow.js?");

/***/ }),

/***/ "./ocpp/src/commands/Reset.js":
/*!************************************!*\
  !*** ./ocpp/src/commands/Reset.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Reset\": () => (/* binding */ Reset),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"TYPE_HARD\": () => (/* binding */ TYPE_HARD),\n/* harmony export */   \"TYPE_SOFT\": () => (/* binding */ TYPE_SOFT)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_Reset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/Reset */ \"./ocpp/ocpp-1.6-schemas/Reset.json\");\n/* harmony import */ var _ocpp_1_6_schemas_ResetResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/ResetResponse */ \"./ocpp/ocpp-1.6-schemas/ResetResponse.json\");\n\n\n\nconst TYPE_HARD = 'Hard';\nconst TYPE_SOFT = 'Soft';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass Reset extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_Reset__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_ResetResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/Reset.js?");

/***/ }),

/***/ "./ocpp/src/commands/SendLocalList.js":
/*!********************************************!*\
  !*** ./ocpp/src/commands/SendLocalList.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"IDTAGINFO_STATUS_ACCEPTED\": () => (/* binding */ IDTAGINFO_STATUS_ACCEPTED),\n/* harmony export */   \"IDTAGINFO_STATUS_BLOCKED\": () => (/* binding */ IDTAGINFO_STATUS_BLOCKED),\n/* harmony export */   \"IDTAGINFO_STATUS_CONCURRENTTX\": () => (/* binding */ IDTAGINFO_STATUS_CONCURRENTTX),\n/* harmony export */   \"IDTAGINFO_STATUS_EXPIRED\": () => (/* binding */ IDTAGINFO_STATUS_EXPIRED),\n/* harmony export */   \"IDTAGINFO_STATUS_INVALID\": () => (/* binding */ IDTAGINFO_STATUS_INVALID),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_FAILED\": () => (/* binding */ STATUS_FAILED),\n/* harmony export */   \"STATUS_NOTSUPPORTED\": () => (/* binding */ STATUS_NOTSUPPORTED),\n/* harmony export */   \"STATUS_VERSIONMISMATCH\": () => (/* binding */ STATUS_VERSIONMISMATCH),\n/* harmony export */   \"SendLocalList\": () => (/* binding */ SendLocalList),\n/* harmony export */   \"UPDATE_TYPE_DIFFERENTIAL\": () => (/* binding */ UPDATE_TYPE_DIFFERENTIAL),\n/* harmony export */   \"UPDATE_TYPE_FULL\": () => (/* binding */ UPDATE_TYPE_FULL)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_SendLocalList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/SendLocalList */ \"./ocpp/ocpp-1.6-schemas/SendLocalList.json\");\n/* harmony import */ var _ocpp_1_6_schemas_SendLocalListResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/SendLocalListResponse */ \"./ocpp/ocpp-1.6-schemas/SendLocalListResponse.json\");\n\n\n\nconst IDTAGINFO_STATUS_ACCEPTED = 'Accepted';\nconst IDTAGINFO_STATUS_BLOCKED = 'Blocked';\nconst IDTAGINFO_STATUS_EXPIRED = 'Expired';\nconst IDTAGINFO_STATUS_INVALID = 'Invalid';\nconst IDTAGINFO_STATUS_CONCURRENTTX = 'ConcurrentTx';\nconst UPDATE_TYPE_DIFFERENTIAL = 'Differential';\nconst UPDATE_TYPE_FULL = 'Full';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_FAILED = 'Failed';\nconst STATUS_NOTSUPPORTED = 'NotSupported';\nconst STATUS_VERSIONMISMATCH = 'VersionMismatch';\nclass SendLocalList extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_SendLocalList__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_SendLocalListResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/SendLocalList.js?");

/***/ }),

/***/ "./ocpp/src/commands/SetChargingProfile.js":
/*!*************************************************!*\
  !*** ./ocpp/src/commands/SetChargingProfile.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CHARGING_PROFILE_KIND_ABSOLUTE\": () => (/* binding */ CHARGING_PROFILE_KIND_ABSOLUTE),\n/* harmony export */   \"CHARGING_PROFILE_KIND_RECURRING\": () => (/* binding */ CHARGING_PROFILE_KIND_RECURRING),\n/* harmony export */   \"CHARGING_PROFILE_KIND_RELATIVE\": () => (/* binding */ CHARGING_PROFILE_KIND_RELATIVE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE),\n/* harmony export */   \"CHARGING_PROFILE_PURPOSE_TXPROFILE\": () => (/* binding */ CHARGING_PROFILE_PURPOSE_TXPROFILE),\n/* harmony export */   \"CHARGING_RATE_UNIT_A\": () => (/* binding */ CHARGING_RATE_UNIT_A),\n/* harmony export */   \"CHARGING_RATE_UNIT_W\": () => (/* binding */ CHARGING_RATE_UNIT_W),\n/* harmony export */   \"RECURRENCY_KIND_DAILY\": () => (/* binding */ RECURRENCY_KIND_DAILY),\n/* harmony export */   \"RECURRENCY_KIND_WEEKLY\": () => (/* binding */ RECURRENCY_KIND_WEEKLY),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"SetChargingProfile\": () => (/* binding */ SetChargingProfile)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_SetChargingProfile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/SetChargingProfile */ \"./ocpp/ocpp-1.6-schemas/SetChargingProfile.json\");\n/* harmony import */ var _ocpp_1_6_schemas_SetChargingProfileResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/SetChargingProfileResponse */ \"./ocpp/ocpp-1.6-schemas/SetChargingProfileResponse.json\");\n\n\n\nconst CHARGING_PROFILE_PURPOSE_CHARGEPOINTMAXPROFILE = 'ChargePointMaxProfile';\nconst CHARGING_PROFILE_PURPOSE_TXDEFAULTPROFILE = 'TxDefaultProfile';\nconst CHARGING_PROFILE_PURPOSE_TXPROFILE = 'TxProfile';\nconst CHARGING_PROFILE_KIND_ABSOLUTE = 'Absolute';\nconst CHARGING_PROFILE_KIND_RECURRING = 'Recurring';\nconst CHARGING_PROFILE_KIND_RELATIVE = 'Relative';\nconst RECURRENCY_KIND_DAILY = 'Daily';\nconst RECURRENCY_KIND_WEEKLY = 'Weekly';\nconst CHARGING_RATE_UNIT_A = 'A';\nconst CHARGING_RATE_UNIT_W = 'W';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nclass SetChargingProfile extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_SetChargingProfile__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_SetChargingProfileResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/SetChargingProfile.js?");

/***/ }),

/***/ "./ocpp/src/commands/StartTransaction.js":
/*!***********************************************!*\
  !*** ./ocpp/src/commands/StartTransaction.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_BLOCKED\": () => (/* binding */ STATUS_BLOCKED),\n/* harmony export */   \"STATUS_CONCURRENTTX\": () => (/* binding */ STATUS_CONCURRENTTX),\n/* harmony export */   \"STATUS_EXPIRED\": () => (/* binding */ STATUS_EXPIRED),\n/* harmony export */   \"STATUS_INVALID\": () => (/* binding */ STATUS_INVALID),\n/* harmony export */   \"StartTransaction\": () => (/* binding */ StartTransaction)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_StartTransaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StartTransaction */ \"./ocpp/ocpp-1.6-schemas/StartTransaction.json\");\n/* harmony import */ var _ocpp_1_6_schemas_StartTransactionResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StartTransactionResponse */ \"./ocpp/ocpp-1.6-schemas/StartTransactionResponse.json\");\n\n\n\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_BLOCKED = 'Blocked';\nconst STATUS_EXPIRED = 'Expired';\nconst STATUS_INVALID = 'Invalid';\nconst STATUS_CONCURRENTTX = 'ConcurrentTx';\nclass StartTransaction extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_StartTransaction__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_StartTransactionResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/StartTransaction.js?");

/***/ }),

/***/ "./ocpp/src/commands/StatusNotification.js":
/*!*************************************************!*\
  !*** ./ocpp/src/commands/StatusNotification.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ERRORCODE_CONNECTORLOCKFAILURE\": () => (/* binding */ ERRORCODE_CONNECTORLOCKFAILURE),\n/* harmony export */   \"ERRORCODE_EVCOMMUNICATIONERROR\": () => (/* binding */ ERRORCODE_EVCOMMUNICATIONERROR),\n/* harmony export */   \"ERRORCODE_GROUNDFAILURE\": () => (/* binding */ ERRORCODE_GROUNDFAILURE),\n/* harmony export */   \"ERRORCODE_HIGHTEMPERATURE\": () => (/* binding */ ERRORCODE_HIGHTEMPERATURE),\n/* harmony export */   \"ERRORCODE_INTERNALERROR\": () => (/* binding */ ERRORCODE_INTERNALERROR),\n/* harmony export */   \"ERRORCODE_LOCALLISTCONFLICT\": () => (/* binding */ ERRORCODE_LOCALLISTCONFLICT),\n/* harmony export */   \"ERRORCODE_NOERROR\": () => (/* binding */ ERRORCODE_NOERROR),\n/* harmony export */   \"ERRORCODE_OTHERERROR\": () => (/* binding */ ERRORCODE_OTHERERROR),\n/* harmony export */   \"ERRORCODE_OVERCURRENTFAILURE\": () => (/* binding */ ERRORCODE_OVERCURRENTFAILURE),\n/* harmony export */   \"ERRORCODE_OVERVOLTAGE\": () => (/* binding */ ERRORCODE_OVERVOLTAGE),\n/* harmony export */   \"ERRORCODE_POWERMETERFAILURE\": () => (/* binding */ ERRORCODE_POWERMETERFAILURE),\n/* harmony export */   \"ERRORCODE_POWERSWITCHFAILURE\": () => (/* binding */ ERRORCODE_POWERSWITCHFAILURE),\n/* harmony export */   \"ERRORCODE_READERFAILURE\": () => (/* binding */ ERRORCODE_READERFAILURE),\n/* harmony export */   \"ERRORCODE_RESETFAILURE\": () => (/* binding */ ERRORCODE_RESETFAILURE),\n/* harmony export */   \"ERRORCODE_UNDERVOLTAGE\": () => (/* binding */ ERRORCODE_UNDERVOLTAGE),\n/* harmony export */   \"ERRORCODE_WEAKSIGNAL\": () => (/* binding */ ERRORCODE_WEAKSIGNAL),\n/* harmony export */   \"STATUS_AVAILABLE\": () => (/* binding */ STATUS_AVAILABLE),\n/* harmony export */   \"STATUS_CHARGING\": () => (/* binding */ STATUS_CHARGING),\n/* harmony export */   \"STATUS_FAULTED\": () => (/* binding */ STATUS_FAULTED),\n/* harmony export */   \"STATUS_FINISHING\": () => (/* binding */ STATUS_FINISHING),\n/* harmony export */   \"STATUS_PREPARING\": () => (/* binding */ STATUS_PREPARING),\n/* harmony export */   \"STATUS_RESERVED\": () => (/* binding */ STATUS_RESERVED),\n/* harmony export */   \"STATUS_SUSPENDEDEV\": () => (/* binding */ STATUS_SUSPENDEDEV),\n/* harmony export */   \"STATUS_SUSPENDEDEVSE\": () => (/* binding */ STATUS_SUSPENDEDEVSE),\n/* harmony export */   \"STATUS_UNAVAILABLE\": () => (/* binding */ STATUS_UNAVAILABLE),\n/* harmony export */   \"StatusNotification\": () => (/* binding */ StatusNotification)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_StatusNotification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StatusNotification */ \"./ocpp/ocpp-1.6-schemas/StatusNotification.json\");\n/* harmony import */ var _ocpp_1_6_schemas_StatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StatusNotificationResponse */ \"./ocpp/ocpp-1.6-schemas/StatusNotificationResponse.json\");\n\n\n\nconst ERRORCODE_CONNECTORLOCKFAILURE = 'ConnectorLockFailure';\nconst ERRORCODE_EVCOMMUNICATIONERROR = 'EVCommunicationError';\nconst ERRORCODE_GROUNDFAILURE = 'GroundFailure';\nconst ERRORCODE_HIGHTEMPERATURE = 'HighTemperature';\nconst ERRORCODE_INTERNALERROR = 'InternalError';\nconst ERRORCODE_LOCALLISTCONFLICT = 'LocalListConflict';\nconst ERRORCODE_NOERROR = 'NoError';\nconst ERRORCODE_OTHERERROR = 'OtherError';\nconst ERRORCODE_OVERCURRENTFAILURE = 'OverCurrentFailure';\nconst ERRORCODE_POWERMETERFAILURE = 'PowerMeterFailure';\nconst ERRORCODE_POWERSWITCHFAILURE = 'PowerSwitchFailure';\nconst ERRORCODE_READERFAILURE = 'ReaderFailure';\nconst ERRORCODE_RESETFAILURE = 'ResetFailure';\nconst ERRORCODE_UNDERVOLTAGE = 'UnderVoltage';\nconst ERRORCODE_OVERVOLTAGE = 'OverVoltage';\nconst ERRORCODE_WEAKSIGNAL = 'WeakSignal';\nconst STATUS_AVAILABLE = 'Available';\nconst STATUS_PREPARING = 'Preparing';\nconst STATUS_CHARGING = 'Charging';\nconst STATUS_SUSPENDEDEVSE = 'SuspendedEVSE';\nconst STATUS_SUSPENDEDEV = 'SuspendedEV';\nconst STATUS_FINISHING = 'Finishing';\nconst STATUS_RESERVED = 'Reserved';\nconst STATUS_UNAVAILABLE = 'Unavailable';\nconst STATUS_FAULTED = 'Faulted';\nclass StatusNotification extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_StatusNotification__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_StatusNotificationResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/StatusNotification.js?");

/***/ }),

/***/ "./ocpp/src/commands/StopTransaction.js":
/*!**********************************************!*\
  !*** ./ocpp/src/commands/StopTransaction.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CONTEXT_DEAUTHORIZED\": () => (/* binding */ CONTEXT_DEAUTHORIZED),\n/* harmony export */   \"CONTEXT_INTERRUPTION_BEGIN\": () => (/* binding */ CONTEXT_INTERRUPTION_BEGIN),\n/* harmony export */   \"CONTEXT_INTERRUPTION_END\": () => (/* binding */ CONTEXT_INTERRUPTION_END),\n/* harmony export */   \"CONTEXT_OTHER\": () => (/* binding */ CONTEXT_OTHER),\n/* harmony export */   \"CONTEXT_SAMPLE_CLOCK\": () => (/* binding */ CONTEXT_SAMPLE_CLOCK),\n/* harmony export */   \"CONTEXT_SAMPLE_PERIODIC\": () => (/* binding */ CONTEXT_SAMPLE_PERIODIC),\n/* harmony export */   \"CONTEXT_TRANSACTION_BEGIN\": () => (/* binding */ CONTEXT_TRANSACTION_BEGIN),\n/* harmony export */   \"CONTEXT_TRANSACTION_END\": () => (/* binding */ CONTEXT_TRANSACTION_END),\n/* harmony export */   \"CONTEXT_TRIGGER\": () => (/* binding */ CONTEXT_TRIGGER),\n/* harmony export */   \"FORMAT_RAW\": () => (/* binding */ FORMAT_RAW),\n/* harmony export */   \"FORMAT_SIGNEDDATA\": () => (/* binding */ FORMAT_SIGNEDDATA),\n/* harmony export */   \"LOCATION_BODY\": () => (/* binding */ LOCATION_BODY),\n/* harmony export */   \"LOCATION_CABLE\": () => (/* binding */ LOCATION_CABLE),\n/* harmony export */   \"LOCATION_EV\": () => (/* binding */ LOCATION_EV),\n/* harmony export */   \"LOCATION_INLET\": () => (/* binding */ LOCATION_INLET),\n/* harmony export */   \"LOCATION_OUTLET\": () => (/* binding */ LOCATION_OUTLET),\n/* harmony export */   \"MEASURAND_CURRENT_EXPORT\": () => (/* binding */ MEASURAND_CURRENT_EXPORT),\n/* harmony export */   \"MEASURAND_CURRENT_IMPORT\": () => (/* binding */ MEASURAND_CURRENT_IMPORT),\n/* harmony export */   \"MEASURAND_CURRENT_OFFERED\": () => (/* binding */ MEASURAND_CURRENT_OFFERED),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL),\n/* harmony export */   \"MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER\": () => (/* binding */ MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER),\n/* harmony export */   \"MEASURAND_FREQUENCY\": () => (/* binding */ MEASURAND_FREQUENCY),\n/* harmony export */   \"MEASURAND_POWER_ACTIVE_EXPORT\": () => (/* binding */ MEASURAND_POWER_ACTIVE_EXPORT),\n/* harmony export */   \"MEASURAND_POWER_ACTIVE_IMPORT\": () => (/* binding */ MEASURAND_POWER_ACTIVE_IMPORT),\n/* harmony export */   \"MEASURAND_POWER_FACTOR\": () => (/* binding */ MEASURAND_POWER_FACTOR),\n/* harmony export */   \"MEASURAND_POWER_OFFERED\": () => (/* binding */ MEASURAND_POWER_OFFERED),\n/* harmony export */   \"MEASURAND_POWER_REACTIVE_EXPORT\": () => (/* binding */ MEASURAND_POWER_REACTIVE_EXPORT),\n/* harmony export */   \"MEASURAND_POWER_REACTIVE_IMPORT\": () => (/* binding */ MEASURAND_POWER_REACTIVE_IMPORT),\n/* harmony export */   \"MEASURAND_RPM\": () => (/* binding */ MEASURAND_RPM),\n/* harmony export */   \"MEASURAND_SOC\": () => (/* binding */ MEASURAND_SOC),\n/* harmony export */   \"MEASURAND_TEMPERATURE\": () => (/* binding */ MEASURAND_TEMPERATURE),\n/* harmony export */   \"MEASURAND_VOLTAGE\": () => (/* binding */ MEASURAND_VOLTAGE),\n/* harmony export */   \"PHASE_L1\": () => (/* binding */ PHASE_L1),\n/* harmony export */   \"PHASE_L1_L2\": () => (/* binding */ PHASE_L1_L2),\n/* harmony export */   \"PHASE_L1_N\": () => (/* binding */ PHASE_L1_N),\n/* harmony export */   \"PHASE_L2\": () => (/* binding */ PHASE_L2),\n/* harmony export */   \"PHASE_L2_L3\": () => (/* binding */ PHASE_L2_L3),\n/* harmony export */   \"PHASE_L2_N\": () => (/* binding */ PHASE_L2_N),\n/* harmony export */   \"PHASE_L3\": () => (/* binding */ PHASE_L3),\n/* harmony export */   \"PHASE_L3_L1\": () => (/* binding */ PHASE_L3_L1),\n/* harmony export */   \"PHASE_L3_N\": () => (/* binding */ PHASE_L3_N),\n/* harmony export */   \"PHASE_N\": () => (/* binding */ PHASE_N),\n/* harmony export */   \"REASON_ACCEPTED\": () => (/* binding */ REASON_ACCEPTED),\n/* harmony export */   \"REASON_DEAUTHORIZED\": () => (/* binding */ REASON_DEAUTHORIZED),\n/* harmony export */   \"REASON_EMERGENCYSTOP\": () => (/* binding */ REASON_EMERGENCYSTOP),\n/* harmony export */   \"REASON_EVDISCONNECTED\": () => (/* binding */ REASON_EVDISCONNECTED),\n/* harmony export */   \"REASON_HARDRESET\": () => (/* binding */ REASON_HARDRESET),\n/* harmony export */   \"REASON_LOCAL\": () => (/* binding */ REASON_LOCAL),\n/* harmony export */   \"REASON_OTHER\": () => (/* binding */ REASON_OTHER),\n/* harmony export */   \"REASON_POWERLOSS\": () => (/* binding */ REASON_POWERLOSS),\n/* harmony export */   \"REASON_REBOOT\": () => (/* binding */ REASON_REBOOT),\n/* harmony export */   \"REASON_REMOTE\": () => (/* binding */ REASON_REMOTE),\n/* harmony export */   \"REASON_SOFTRESET\": () => (/* binding */ REASON_SOFTRESET),\n/* harmony export */   \"REASON_UNLOCKCOMMAND\": () => (/* binding */ REASON_UNLOCKCOMMAND),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_BLOCKED\": () => (/* binding */ STATUS_BLOCKED),\n/* harmony export */   \"STATUS_CONCURRENTTX\": () => (/* binding */ STATUS_CONCURRENTTX),\n/* harmony export */   \"STATUS_EXPIRED\": () => (/* binding */ STATUS_EXPIRED),\n/* harmony export */   \"STATUS_INVALID\": () => (/* binding */ STATUS_INVALID),\n/* harmony export */   \"StopTransaction\": () => (/* binding */ StopTransaction),\n/* harmony export */   \"UNIT_A\": () => (/* binding */ UNIT_A),\n/* harmony export */   \"UNIT_CELCIUS\": () => (/* binding */ UNIT_CELCIUS),\n/* harmony export */   \"UNIT_FAHRENHEIT\": () => (/* binding */ UNIT_FAHRENHEIT),\n/* harmony export */   \"UNIT_K\": () => (/* binding */ UNIT_K),\n/* harmony export */   \"UNIT_KVA\": () => (/* binding */ UNIT_KVA),\n/* harmony export */   \"UNIT_KVAR\": () => (/* binding */ UNIT_KVAR),\n/* harmony export */   \"UNIT_KVARH\": () => (/* binding */ UNIT_KVARH),\n/* harmony export */   \"UNIT_KW\": () => (/* binding */ UNIT_KW),\n/* harmony export */   \"UNIT_KWH\": () => (/* binding */ UNIT_KWH),\n/* harmony export */   \"UNIT_PERCENT\": () => (/* binding */ UNIT_PERCENT),\n/* harmony export */   \"UNIT_V\": () => (/* binding */ UNIT_V),\n/* harmony export */   \"UNIT_VA\": () => (/* binding */ UNIT_VA),\n/* harmony export */   \"UNIT_VAR\": () => (/* binding */ UNIT_VAR),\n/* harmony export */   \"UNIT_VARH\": () => (/* binding */ UNIT_VARH),\n/* harmony export */   \"UNIT_W\": () => (/* binding */ UNIT_W),\n/* harmony export */   \"UNIT_WH\": () => (/* binding */ UNIT_WH)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_StopTransaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StopTransaction */ \"./ocpp/ocpp-1.6-schemas/StopTransaction.json\");\n/* harmony import */ var _ocpp_1_6_schemas_StopTransactionResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/StopTransactionResponse */ \"./ocpp/ocpp-1.6-schemas/StopTransactionResponse.json\");\n\n\n\nconst REASON_ACCEPTED = 'Accepted';\nconst REASON_EMERGENCYSTOP = 'EmergencyStop';\nconst REASON_EVDISCONNECTED = 'EVDisconnected';\nconst REASON_HARDRESET = 'HardReset';\nconst REASON_LOCAL = 'Local';\nconst REASON_OTHER = 'Other';\nconst REASON_POWERLOSS = 'PowerLoss';\nconst REASON_REBOOT = 'Reboot';\nconst REASON_REMOTE = 'Remote';\nconst REASON_SOFTRESET = 'SoftReset';\nconst REASON_UNLOCKCOMMAND = 'UnlockCommand';\nconst REASON_DEAUTHORIZED = 'DeAuthorized';\nconst CONTEXT_DEAUTHORIZED = 'DeAuthorized';\nconst CONTEXT_INTERRUPTION_BEGIN = 'Interruption.Begin';\nconst CONTEXT_INTERRUPTION_END = 'Interruption.End';\nconst CONTEXT_SAMPLE_CLOCK = 'Sample.Clock';\nconst CONTEXT_SAMPLE_PERIODIC = 'Sample.Periodic';\nconst CONTEXT_TRANSACTION_BEGIN = 'Transaction.Begin';\nconst CONTEXT_TRANSACTION_END = 'Transaction.End';\nconst CONTEXT_TRIGGER = 'Trigger';\nconst CONTEXT_OTHER = 'Other';\nconst FORMAT_RAW = 'Raw';\nconst FORMAT_SIGNEDDATA = 'SignedData';\nconst MEASURAND_ENERGY_ACTIVE_EXPORT_REGISTER = 'Energy.Active.Export.Register';\nconst MEASURAND_ENERGY_ACTIVE_IMPORT_REGISTER = 'Energy.Active.Import.Register';\nconst MEASURAND_ENERGY_REACTIVE_EXPORT_REGISTER = 'Energy.Reactive.Export.Register';\nconst MEASURAND_ENERGY_REACTIVE_IMPORT_REGISTER = 'Energy.Reactive.Import.Register';\nconst MEASURAND_ENERGY_ACTIVE_EXPORT_INTERVAL = 'Energy.Active.Export.Interval';\nconst MEASURAND_ENERGY_ACTIVE_IMPORT_INTERVAL = 'Energy.Active.Import.Interval';\nconst MEASURAND_ENERGY_REACTIVE_EXPORT_INTERVAL = 'Energy.Reactive.Export.Interval';\nconst MEASURAND_ENERGY_REACTIVE_IMPORT_INTERVAL = 'Energy.Reactive.Import.Interval';\nconst MEASURAND_POWER_ACTIVE_EXPORT = 'Power.Active.Export';\nconst MEASURAND_POWER_ACTIVE_IMPORT = 'Power.Active.Import';\nconst MEASURAND_POWER_OFFERED = 'Power.Offered';\nconst MEASURAND_POWER_REACTIVE_EXPORT = 'Power.Reactive.Export';\nconst MEASURAND_POWER_REACTIVE_IMPORT = 'Power.Reactive.Import';\nconst MEASURAND_POWER_FACTOR = 'Power.Factor';\nconst MEASURAND_CURRENT_IMPORT = 'Current.Import';\nconst MEASURAND_CURRENT_EXPORT = 'Current.Export';\nconst MEASURAND_CURRENT_OFFERED = 'Current.Offered';\nconst MEASURAND_VOLTAGE = 'Voltage';\nconst MEASURAND_FREQUENCY = 'Frequency';\nconst MEASURAND_TEMPERATURE = 'Temperature';\nconst MEASURAND_SOC = 'SoC';\nconst MEASURAND_RPM = 'RPM';\nconst PHASE_L1 = 'L1';\nconst PHASE_L2 = 'L2';\nconst PHASE_L3 = 'L3';\nconst PHASE_N = 'N';\nconst PHASE_L1_N = 'L1-N';\nconst PHASE_L2_N = 'L2-N';\nconst PHASE_L3_N = 'L3-N';\nconst PHASE_L1_L2 = 'L1-L2';\nconst PHASE_L2_L3 = 'L2-L3';\nconst PHASE_L3_L1 = 'L3-L1';\nconst LOCATION_CABLE = 'Cable';\nconst LOCATION_EV = 'EV';\nconst LOCATION_INLET = 'Inlet';\nconst LOCATION_OUTLET = 'Outlet';\nconst LOCATION_BODY = 'Body';\nconst UNIT_WH = 'Wh';\nconst UNIT_KWH = 'kWh';\nconst UNIT_VARH = 'varh';\nconst UNIT_KVARH = 'kvarh';\nconst UNIT_W = 'W';\nconst UNIT_KW = 'kW';\nconst UNIT_VA = 'VA';\nconst UNIT_KVA = 'kVA';\nconst UNIT_VAR = 'var';\nconst UNIT_KVAR = 'kvar';\nconst UNIT_A = 'A';\nconst UNIT_V = 'V';\nconst UNIT_K = 'K';\nconst UNIT_CELCIUS = 'Celcius';\nconst UNIT_FAHRENHEIT = 'Fahrenheit';\nconst UNIT_PERCENT = 'Percent';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_BLOCKED = 'Blocked';\nconst STATUS_EXPIRED = 'Expired';\nconst STATUS_INVALID = 'Invalid';\nconst STATUS_CONCURRENTTX = 'ConcurrentTx';\nclass StopTransaction extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_StopTransaction__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_StopTransactionResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/StopTransaction.js?");

/***/ }),

/***/ "./ocpp/src/commands/TriggerMessage.js":
/*!*********************************************!*\
  !*** ./ocpp/src/commands/TriggerMessage.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"REQUESTED_MESSAGE_BOOTNOTIFICATION\": () => (/* binding */ REQUESTED_MESSAGE_BOOTNOTIFICATION),\n/* harmony export */   \"REQUESTED_MESSAGE_DIAGNOSTICSSTATUSNOTIFICATION\": () => (/* binding */ REQUESTED_MESSAGE_DIAGNOSTICSSTATUSNOTIFICATION),\n/* harmony export */   \"REQUESTED_MESSAGE_FIRMWARESTATUSNOTIFICATION\": () => (/* binding */ REQUESTED_MESSAGE_FIRMWARESTATUSNOTIFICATION),\n/* harmony export */   \"REQUESTED_MESSAGE_HEARTBEAT\": () => (/* binding */ REQUESTED_MESSAGE_HEARTBEAT),\n/* harmony export */   \"REQUESTED_MESSAGE_METERVALUES\": () => (/* binding */ REQUESTED_MESSAGE_METERVALUES),\n/* harmony export */   \"REQUESTED_MESSAGE_STATUSNOTIFICATION\": () => (/* binding */ REQUESTED_MESSAGE_STATUSNOTIFICATION),\n/* harmony export */   \"STATUS_ACCEPTED\": () => (/* binding */ STATUS_ACCEPTED),\n/* harmony export */   \"STATUS_NOTIMPLEMENTED\": () => (/* binding */ STATUS_NOTIMPLEMENTED),\n/* harmony export */   \"STATUS_REJECTED\": () => (/* binding */ STATUS_REJECTED),\n/* harmony export */   \"TriggerMessage\": () => (/* binding */ TriggerMessage)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_TriggerMessage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/TriggerMessage */ \"./ocpp/ocpp-1.6-schemas/TriggerMessage.json\");\n/* harmony import */ var _ocpp_1_6_schemas_TriggerMessageResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/TriggerMessageResponse */ \"./ocpp/ocpp-1.6-schemas/TriggerMessageResponse.json\");\n\n\n\nconst REQUESTED_MESSAGE_BOOTNOTIFICATION = 'BootNotification';\nconst REQUESTED_MESSAGE_DIAGNOSTICSSTATUSNOTIFICATION = 'DiagnosticsStatusNotification';\nconst REQUESTED_MESSAGE_FIRMWARESTATUSNOTIFICATION = 'FirmwareStatusNotification';\nconst REQUESTED_MESSAGE_HEARTBEAT = 'Heartbeat';\nconst REQUESTED_MESSAGE_METERVALUES = 'MeterValues';\nconst REQUESTED_MESSAGE_STATUSNOTIFICATION = 'StatusNotification';\nconst STATUS_ACCEPTED = 'Accepted';\nconst STATUS_REJECTED = 'Rejected';\nconst STATUS_NOTIMPLEMENTED = 'NotImplemented';\nclass TriggerMessage extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_TriggerMessage__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_TriggerMessageResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/TriggerMessage.js?");

/***/ }),

/***/ "./ocpp/src/commands/UnlockConnector.js":
/*!**********************************************!*\
  !*** ./ocpp/src/commands/UnlockConnector.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"STATUS_NOTSUPPORTED\": () => (/* binding */ STATUS_NOTSUPPORTED),\n/* harmony export */   \"STATUS_UNLOCKED\": () => (/* binding */ STATUS_UNLOCKED),\n/* harmony export */   \"STATUS_UNLOCKFAILED\": () => (/* binding */ STATUS_UNLOCKFAILED),\n/* harmony export */   \"UnlockConnector\": () => (/* binding */ UnlockConnector)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_UnlockConnector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/UnlockConnector */ \"./ocpp/ocpp-1.6-schemas/UnlockConnector.json\");\n/* harmony import */ var _ocpp_1_6_schemas_UnlockConnectorResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/UnlockConnectorResponse */ \"./ocpp/ocpp-1.6-schemas/UnlockConnectorResponse.json\");\n\n\n\nconst STATUS_UNLOCKED = 'Unlocked';\nconst STATUS_UNLOCKFAILED = 'UnlockFailed';\nconst STATUS_NOTSUPPORTED = 'NotSupported';\nclass UnlockConnector extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_UnlockConnector__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_UnlockConnectorResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/UnlockConnector.js?");

/***/ }),

/***/ "./ocpp/src/commands/UpdateFirmware.js":
/*!*********************************************!*\
  !*** ./ocpp/src/commands/UpdateFirmware.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UpdateFirmware\": () => (/* binding */ UpdateFirmware)\n/* harmony export */ });\n/* harmony import */ var _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseCommand.js */ \"./ocpp/src/commands/BaseCommand.js\");\n/* harmony import */ var _ocpp_1_6_schemas_UpdateFirmware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/UpdateFirmware */ \"./ocpp/ocpp-1.6-schemas/UpdateFirmware.json\");\n/* harmony import */ var _ocpp_1_6_schemas_UpdateFirmwareResponse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ocpp-1.6-schemas/UpdateFirmwareResponse */ \"./ocpp/ocpp-1.6-schemas/UpdateFirmwareResponse.json\");\n\n\n\nclass UpdateFirmware extends _BaseCommand_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(values) {\n    super(_ocpp_1_6_schemas_UpdateFirmware__WEBPACK_IMPORTED_MODULE_1__, _ocpp_1_6_schemas_UpdateFirmwareResponse__WEBPACK_IMPORTED_MODULE_2__, values);\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/UpdateFirmware.js?");

/***/ }),

/***/ "./ocpp/src/commands/index.js":
/*!************************************!*\
  !*** ./ocpp/src/commands/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CENTRAL_SYSTEM_COMMANDS\": () => (/* binding */ CENTRAL_SYSTEM_COMMANDS),\n/* harmony export */   \"CHARGE_POINT_COMMANDS\": () => (/* binding */ CHARGE_POINT_COMMANDS),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Authorize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Authorize.js */ \"./ocpp/src/commands/Authorize.js\");\n/* harmony import */ var _BootNotification_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BootNotification.js */ \"./ocpp/src/commands/BootNotification.js\");\n/* harmony import */ var _CancelReservation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CancelReservation.js */ \"./ocpp/src/commands/CancelReservation.js\");\n/* harmony import */ var _ChangeAvailability_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ChangeAvailability.js */ \"./ocpp/src/commands/ChangeAvailability.js\");\n/* harmony import */ var _ChangeConfiguration_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ChangeConfiguration.js */ \"./ocpp/src/commands/ChangeConfiguration.js\");\n/* harmony import */ var _ClearCache_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ClearCache.js */ \"./ocpp/src/commands/ClearCache.js\");\n/* harmony import */ var _ClearChargingProfile_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ClearChargingProfile.js */ \"./ocpp/src/commands/ClearChargingProfile.js\");\n/* harmony import */ var _DataTransfer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./DataTransfer.js */ \"./ocpp/src/commands/DataTransfer.js\");\n/* harmony import */ var _DiagnosticsStatusNotification_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DiagnosticsStatusNotification.js */ \"./ocpp/src/commands/DiagnosticsStatusNotification.js\");\n/* harmony import */ var _FirmwareStatusNotification_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./FirmwareStatusNotification.js */ \"./ocpp/src/commands/FirmwareStatusNotification.js\");\n/* harmony import */ var _GetCompositeSchedule_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./GetCompositeSchedule.js */ \"./ocpp/src/commands/GetCompositeSchedule.js\");\n/* harmony import */ var _GetConfiguration_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./GetConfiguration.js */ \"./ocpp/src/commands/GetConfiguration.js\");\n/* harmony import */ var _GetDiagnostics_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./GetDiagnostics.js */ \"./ocpp/src/commands/GetDiagnostics.js\");\n/* harmony import */ var _GetLocalListVersion_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./GetLocalListVersion.js */ \"./ocpp/src/commands/GetLocalListVersion.js\");\n/* harmony import */ var _Heartbeat_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Heartbeat.js */ \"./ocpp/src/commands/Heartbeat.js\");\n/* harmony import */ var _MeterValues_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./MeterValues.js */ \"./ocpp/src/commands/MeterValues.js\");\n/* harmony import */ var _RemoteStartTransaction_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./RemoteStartTransaction.js */ \"./ocpp/src/commands/RemoteStartTransaction.js\");\n/* harmony import */ var _RemoteStopTransaction_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./RemoteStopTransaction.js */ \"./ocpp/src/commands/RemoteStopTransaction.js\");\n/* harmony import */ var _ReserveNow_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./ReserveNow.js */ \"./ocpp/src/commands/ReserveNow.js\");\n/* harmony import */ var _Reset_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./Reset.js */ \"./ocpp/src/commands/Reset.js\");\n/* harmony import */ var _SendLocalList_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./SendLocalList.js */ \"./ocpp/src/commands/SendLocalList.js\");\n/* harmony import */ var _SetChargingProfile_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./SetChargingProfile.js */ \"./ocpp/src/commands/SetChargingProfile.js\");\n/* harmony import */ var _StartTransaction_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./StartTransaction.js */ \"./ocpp/src/commands/StartTransaction.js\");\n/* harmony import */ var _StatusNotification_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./StatusNotification.js */ \"./ocpp/src/commands/StatusNotification.js\");\n/* harmony import */ var _StopTransaction_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./StopTransaction.js */ \"./ocpp/src/commands/StopTransaction.js\");\n/* harmony import */ var _TriggerMessage_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./TriggerMessage.js */ \"./ocpp/src/commands/TriggerMessage.js\");\n/* harmony import */ var _UnlockConnector_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./UnlockConnector.js */ \"./ocpp/src/commands/UnlockConnector.js\");\n/* harmony import */ var _UpdateFirmware_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./UpdateFirmware.js */ \"./ocpp/src/commands/UpdateFirmware.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  Authorize: _Authorize_js__WEBPACK_IMPORTED_MODULE_0__.Authorize,\n  BootNotification: _BootNotification_js__WEBPACK_IMPORTED_MODULE_1__.BootNotification,\n  CancelReservation: _CancelReservation_js__WEBPACK_IMPORTED_MODULE_2__.CancelReservation,\n  ChangeAvailability: _ChangeAvailability_js__WEBPACK_IMPORTED_MODULE_3__.ChangeAvailability,\n  ChangeConfiguration: _ChangeConfiguration_js__WEBPACK_IMPORTED_MODULE_4__.ChangeConfiguration,\n  ClearCache: _ClearCache_js__WEBPACK_IMPORTED_MODULE_5__.ClearCache,\n  ClearChargingProfile: _ClearChargingProfile_js__WEBPACK_IMPORTED_MODULE_6__.ClearChargingProfile,\n  DataTransfer: _DataTransfer_js__WEBPACK_IMPORTED_MODULE_7__.DataTransfer,\n  DiagnosticsStatusNotification: _DiagnosticsStatusNotification_js__WEBPACK_IMPORTED_MODULE_8__.DiagnosticsStatusNotification,\n  FirmwareStatusNotification: _FirmwareStatusNotification_js__WEBPACK_IMPORTED_MODULE_9__.FirmwareStatusNotification,\n  GetCompositeSchedule: _GetCompositeSchedule_js__WEBPACK_IMPORTED_MODULE_10__.GetCompositeSchedule,\n  GetConfiguration: _GetConfiguration_js__WEBPACK_IMPORTED_MODULE_11__.GetConfiguration,\n  GetDiagnostics: _GetDiagnostics_js__WEBPACK_IMPORTED_MODULE_12__.GetDiagnostics,\n  GetLocalListVersion: _GetLocalListVersion_js__WEBPACK_IMPORTED_MODULE_13__.GetLocalListVersion,\n  Heartbeat: _Heartbeat_js__WEBPACK_IMPORTED_MODULE_14__.Heartbeat,\n  MeterValues: _MeterValues_js__WEBPACK_IMPORTED_MODULE_15__.MeterValues,\n  RemoteStartTransaction: _RemoteStartTransaction_js__WEBPACK_IMPORTED_MODULE_16__.RemoteStartTransaction,\n  RemoteStopTransaction: _RemoteStopTransaction_js__WEBPACK_IMPORTED_MODULE_17__.RemoteStopTransaction,\n  ReserveNow: _ReserveNow_js__WEBPACK_IMPORTED_MODULE_18__.ReserveNow,\n  Reset: _Reset_js__WEBPACK_IMPORTED_MODULE_19__.Reset,\n  SendLocalList: _SendLocalList_js__WEBPACK_IMPORTED_MODULE_20__.SendLocalList,\n  SetChargingProfile: _SetChargingProfile_js__WEBPACK_IMPORTED_MODULE_21__.SetChargingProfile,\n  StartTransaction: _StartTransaction_js__WEBPACK_IMPORTED_MODULE_22__.StartTransaction,\n  StatusNotification: _StatusNotification_js__WEBPACK_IMPORTED_MODULE_23__.StatusNotification,\n  StopTransaction: _StopTransaction_js__WEBPACK_IMPORTED_MODULE_24__.StopTransaction,\n  TriggerMessage: _TriggerMessage_js__WEBPACK_IMPORTED_MODULE_25__.TriggerMessage,\n  UnlockConnector: _UnlockConnector_js__WEBPACK_IMPORTED_MODULE_26__.UnlockConnector,\n  UpdateFirmware: _UpdateFirmware_js__WEBPACK_IMPORTED_MODULE_27__.UpdateFirmware\n});\nconst CHARGE_POINT_COMMANDS = {\n  Authorize: _Authorize_js__WEBPACK_IMPORTED_MODULE_0__.Authorize,\n  BootNotification: _BootNotification_js__WEBPACK_IMPORTED_MODULE_1__.BootNotification,\n  DataTransfer: _DataTransfer_js__WEBPACK_IMPORTED_MODULE_7__.DataTransfer,\n  DiagnosticsStatusNotification: _DiagnosticsStatusNotification_js__WEBPACK_IMPORTED_MODULE_8__.DiagnosticsStatusNotification,\n  FirmwareStatusNotification: _FirmwareStatusNotification_js__WEBPACK_IMPORTED_MODULE_9__.FirmwareStatusNotification,\n  Heartbeat: _Heartbeat_js__WEBPACK_IMPORTED_MODULE_14__.Heartbeat,\n  MeterValues: _MeterValues_js__WEBPACK_IMPORTED_MODULE_15__.MeterValues,\n  StartTransaction: _StartTransaction_js__WEBPACK_IMPORTED_MODULE_22__.StartTransaction,\n  StatusNotification: _StatusNotification_js__WEBPACK_IMPORTED_MODULE_23__.StatusNotification,\n  StopTransaction: _StopTransaction_js__WEBPACK_IMPORTED_MODULE_24__.StopTransaction\n};\nconst CENTRAL_SYSTEM_COMMANDS = {\n  CancelReservation: _CancelReservation_js__WEBPACK_IMPORTED_MODULE_2__.CancelReservation,\n  ChangeAvailability: _ChangeAvailability_js__WEBPACK_IMPORTED_MODULE_3__.ChangeAvailability,\n  ChangeConfiguration: _ChangeConfiguration_js__WEBPACK_IMPORTED_MODULE_4__.ChangeConfiguration,\n  ClearCache: _ClearCache_js__WEBPACK_IMPORTED_MODULE_5__.ClearCache,\n  ClearChargingProfile: _ClearChargingProfile_js__WEBPACK_IMPORTED_MODULE_6__.ClearChargingProfile,\n  DataTransfer: _DataTransfer_js__WEBPACK_IMPORTED_MODULE_7__.DataTransfer,\n  GetCompositeSchedule: _GetCompositeSchedule_js__WEBPACK_IMPORTED_MODULE_10__.GetCompositeSchedule,\n  GetConfiguration: _GetConfiguration_js__WEBPACK_IMPORTED_MODULE_11__.GetConfiguration,\n  GetDiagnostics: _GetDiagnostics_js__WEBPACK_IMPORTED_MODULE_12__.GetDiagnostics,\n  GetLocalListVersion: _GetLocalListVersion_js__WEBPACK_IMPORTED_MODULE_13__.GetLocalListVersion,\n  RemoteStartTransaction: _RemoteStartTransaction_js__WEBPACK_IMPORTED_MODULE_16__.RemoteStartTransaction,\n  RemoteStopTransaction: _RemoteStopTransaction_js__WEBPACK_IMPORTED_MODULE_17__.RemoteStopTransaction,\n  ReserveNow: _ReserveNow_js__WEBPACK_IMPORTED_MODULE_18__.ReserveNow,\n  Reset: _Reset_js__WEBPACK_IMPORTED_MODULE_19__.Reset,\n  SendLocalList: _SendLocalList_js__WEBPACK_IMPORTED_MODULE_20__.SendLocalList,\n  SetChargingProfile: _SetChargingProfile_js__WEBPACK_IMPORTED_MODULE_21__.SetChargingProfile,\n  TriggerMessage: _TriggerMessage_js__WEBPACK_IMPORTED_MODULE_25__.TriggerMessage,\n  UnlockConnector: _UnlockConnector_js__WEBPACK_IMPORTED_MODULE_26__.UnlockConnector,\n  UpdateFirmware: _UpdateFirmware_js__WEBPACK_IMPORTED_MODULE_27__.UpdateFirmware\n};\n\n//# sourceURL=webpack://epp/./ocpp/src/commands/index.js?");

/***/ }),

/***/ "./ocpp/src/connection.js":
/*!********************************!*\
  !*** ./ocpp/src/connection.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Connection\": () => (/* binding */ Connection)\n/* harmony export */ });\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ \"uuid\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _commands_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./commands/index.js */ \"./ocpp/src/commands/index.js\");\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants.js */ \"./ocpp/src/constants.js\");\n/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./helpers.js */ \"./ocpp/src/helpers.js\");\n/* harmony import */ var _ocppError_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ocppError.js */ \"./ocpp/src/ocppError.js\");\n\n\n\n\n\n\n\nconst debug = debug__WEBPACK_IMPORTED_MODULE_2___default()(_constants_js__WEBPACK_IMPORTED_MODULE_4__.DEBUG_LIBNAME);\nclass Connection {\n  constructor(socket, req = null, logger = null) {\n    this.socket = socket;\n    this.req = req;\n    this.requests = {};\n    this.logger = logger;\n    if (req) {\n      this.url = req && req.url;\n      const ip = req && (req.connection && req.connection.remoteAddress || req.headers['x-forwarded-for']);\n      if (this.logger) {\n        this.logger.debug({\n          id: this.url,\n          message: `New connection from \"${ip}\", protocol \"${socket.protocol}\", url \"${this.url}\"`\n        });\n      } else {\n        debug(`New connection from \"${ip}\", protocol \"${socket.protocol}\", url \"${this.url}\"`);\n      }\n    } else {\n      this.url = 'SERVER';\n      debug(`New connection to server`);\n    }\n    socket.on('message', msg => this.onMessage(msg));\n    socket.on('error', err => {\n      console.info(err);\n    });\n  }\n  async onMessage(message) {\n    let messageType, messageId, commandNameOrPayload, commandPayload, errorDetails;\n    try {\n      [messageType, messageId, commandNameOrPayload, commandPayload, errorDetails] = JSON.parse(message);\n    } catch (err) {\n      throw new Error(`Failed to parse message: \"${message}\", ${err.message}`);\n    }\n    switch (messageType) {\n      case _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_MESSAGE:\n        // request\n        if (this.logger) {\n          this.logger.debug(`>> ${this.url}: ${message}`);\n        } else {\n          debug(`>> ${this.url}: ${message}`);\n        }\n        const CommandModel = _commands_index_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"][commandNameOrPayload];\n        if (!CommandModel) {\n          throw new Error(`Unknown command ${commandNameOrPayload}`);\n        }\n        let commandRequest, responseData, responseObj;\n        try {\n          commandRequest = new CommandModel(commandPayload);\n        } catch (err) {\n          // send error if payload didn't pass the validation\n          return await this.sendError(messageId, new _ocppError_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"](_ocppError_js__WEBPACK_IMPORTED_MODULE_6__.ERROR_FORMATIONVIOLATION, err.message));\n        }\n        try {\n          responseData = await this.onRequest(commandRequest);\n          responseObj = commandRequest.createResponse(responseData);\n        } catch (err) {\n          return await this.sendError(messageId, err);\n        }\n        try {\n          await this.sendMessage(messageId, responseObj, _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALLRESULT_MESSAGE);\n        } catch (err) {\n          await this.sendError(messageId, err);\n        }\n        break;\n      case _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALLRESULT_MESSAGE:\n        // response\n        if (this.logger) {\n          this.logger.debug(`>> ${this.url}: ${message}`);\n        } else {\n          debug(`>> ${this.url}: ${message}`);\n        }\n        const [responseCallback] = this.requests[messageId];\n        if (!responseCallback) {\n          throw new Error(`Response for unknown message ${messageId}`);\n        }\n        delete this.requests[messageId];\n        responseCallback(commandNameOrPayload);\n        break;\n      case _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALLERROR_MESSAGE:\n        // error response\n        if (this.logger) {\n          this.logger.debug(`>> ${this.url}: ${message}`);\n        } else {\n          debug(`>> ${this.url}: ${message}`);\n        }\n        if (!this.requests[messageId]) {\n          throw new Error(`Response for unknown message ${messageId}`);\n        }\n        const [, rejectCallback] = this.requests[messageId];\n        delete this.requests[messageId];\n        rejectCallback(new _ocppError_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"](commandNameOrPayload, commandPayload, errorDetails));\n        break;\n      default:\n        throw new Error(`Wrong message type ${messageType}`);\n    }\n  }\n  send(command, messageType = _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_MESSAGE) {\n    return this.sendMessage((0,uuid__WEBPACK_IMPORTED_MODULE_0__.v4)(), command, messageType);\n  }\n  sendError(messageId, err) {\n    if (this.logger) {\n      this.logger.debug(`Error: ${err.message}`);\n    } else {\n      debug(`Error: ${err.message}`);\n    }\n    const error = err instanceof _ocppError_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"] ? err : new _ocppError_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"](_ocppError_js__WEBPACK_IMPORTED_MODULE_6__.ERROR_INTERNALERROR, err.message);\n    return this.sendMessage(messageId, error, _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALLERROR_MESSAGE);\n  }\n  sendMessage(messageId, command, messageType = _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALLRESULT_MESSAGE) {\n    const socket = this.socket;\n    const self = this;\n    const commandValues = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.getObjectValues)(command);\n    return new Promise((resolve, reject) => {\n      let messageToSend;\n      switch (messageType) {\n        case _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_MESSAGE:\n          this.requests[messageId] = [onResponse, onRejectResponse];\n          const commandName = command.getCommandName();\n          messageToSend = JSON.stringify([messageType, messageId, commandName, commandValues]);\n          break;\n        case _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALLRESULT_MESSAGE:\n          messageToSend = JSON.stringify([messageType, messageId, commandValues]);\n          break;\n        case _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALLERROR_MESSAGE:\n          const {\n            code,\n            message,\n            details\n          } = command;\n          messageToSend = JSON.stringify([messageType, messageId, code, message, details]);\n          break;\n      }\n      if (this.logger) {\n        this.logger.debug(`<< ${messageToSend}`);\n      } else {\n        debug(`<< ${messageToSend}`);\n      }\n      if (socket.readyState === (ws__WEBPACK_IMPORTED_MODULE_1___default().OPEN)) {\n        socket.send(messageToSend);\n      } else {\n        return onRejectResponse(`Socket closed ${messageId}`);\n      }\n      if (messageType !== _constants_js__WEBPACK_IMPORTED_MODULE_4__.CALL_MESSAGE) {\n        resolve();\n      } else {\n        setTimeout(() => onRejectResponse(`Timeout for message ${messageId}`), _constants_js__WEBPACK_IMPORTED_MODULE_4__.SOCKET_TIMEOUT);\n      }\n      function onResponse(payload) {\n        const response = command.createResponse(payload);\n        return resolve(response);\n      }\n      function onRejectResponse(reason) {\n        self.requests[messageId] = () => {};\n        const error = reason instanceof _ocppError_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"] ? reason : new Error(reason);\n        reject(error);\n      }\n    });\n  }\n  onRequest(request) {}\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/connection.js?");

/***/ }),

/***/ "./ocpp/src/connector.js":
/*!*******************************!*\
  !*** ./ocpp/src/connector.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Connector)\n/* harmony export */ });\n/* harmony import */ var _commands_StatusNotification_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commands/StatusNotification.js */ \"./ocpp/src/commands/StatusNotification.js\");\n\nclass Connector {\n  constructor(connectorId) {\n    this.connectorId = connectorId;\n    this.status = _commands_StatusNotification_js__WEBPACK_IMPORTED_MODULE_0__.STATUS_AVAILABLE;\n    this.errorCode = _commands_StatusNotification_js__WEBPACK_IMPORTED_MODULE_0__.ERRORCODE_NOERROR;\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/connector.js?");

/***/ }),

/***/ "./ocpp/src/constants.js":
/*!*******************************!*\
  !*** ./ocpp/src/constants.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CALLERROR_MESSAGE\": () => (/* binding */ CALLERROR_MESSAGE),\n/* harmony export */   \"CALLRESULT_MESSAGE\": () => (/* binding */ CALLRESULT_MESSAGE),\n/* harmony export */   \"CALL_MESSAGE\": () => (/* binding */ CALL_MESSAGE),\n/* harmony export */   \"DEBUG_LIBNAME\": () => (/* binding */ DEBUG_LIBNAME),\n/* harmony export */   \"OCPP_PROTOCOL_1_6\": () => (/* binding */ OCPP_PROTOCOL_1_6),\n/* harmony export */   \"SOCKET_TIMEOUT\": () => (/* binding */ SOCKET_TIMEOUT)\n/* harmony export */ });\nconst DEBUG_LIBNAME = 'ocpp-eliftech';\nconst OCPP_PROTOCOL_1_6 = 'ocpp1.6';\nconst SOCKET_TIMEOUT = 30 * 1000; // 30 sec\n\n// ## MessageType constants\n//\n// To identify the type of message one of the following Message Type Numbers MUST be used.\n//\n// When a server receives a message with a Message Type Number not in this list, it SHALL ignore the\n// message payload. Each message type may have additional required fields.\nconst CALL_MESSAGE = 2; // Client-to-Server\nconst CALLRESULT_MESSAGE = 3; // Server-to-Client\nconst CALLERROR_MESSAGE = 4; // Server-to-Client\n\n//# sourceURL=webpack://epp/./ocpp/src/constants.js?");

/***/ }),

/***/ "./ocpp/src/helpers.js":
/*!*****************************!*\
  !*** ./ocpp/src/helpers.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"applyPropertiesValidators\": () => (/* binding */ applyPropertiesValidators),\n/* harmony export */   \"getObjectValues\": () => (/* binding */ getObjectValues)\n/* harmony export */ });\n/* harmony import */ var joi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! joi */ \"joi\");\n/* harmony import */ var joi__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(joi__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var enjoi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! enjoi */ \"enjoi\");\n/* harmony import */ var enjoi__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(enjoi__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst MODEL_VALUES_SYMBOL = Symbol('modelValues');\nfunction applyPropertiesValidators(object, schema, values = {}) {\n  const joiSchema = new (enjoi__WEBPACK_IMPORTED_MODULE_1___default())(schema);\n  object[MODEL_VALUES_SYMBOL] = {};\n  const properties = {};\n  for (let key in schema.properties) {\n    if (!schema.properties.hasOwnProperty(key)) {\n      return;\n    }\n    const validator = joi__WEBPACK_IMPORTED_MODULE_0___default().reach(joiSchema, key);\n    validate(key, values[key], validator);\n    object[MODEL_VALUES_SYMBOL][key] = values[key];\n    properties[key] = {\n      get: () => object[MODEL_VALUES_SYMBOL][key],\n      set: val => {\n        validate(key, val, validator);\n        val === undefined ? delete object[MODEL_VALUES_SYMBOL][key] : object[MODEL_VALUES_SYMBOL][key] = val;\n      },\n      enumerable: true,\n      configurable: false\n    };\n  }\n  Object.defineProperties(object, properties);\n  function validate(fieldName, value, schema) {\n    const {\n      error\n    } = joi__WEBPACK_IMPORTED_MODULE_0___default().validate(value, schema);\n    if (error !== null) {\n      throw new Error(`Invalid value \"${value}\" for field ${fieldName}`);\n    }\n  }\n}\nfunction getObjectValues(object) {\n  const values = {\n    ...(object[MODEL_VALUES_SYMBOL] || {})\n  };\n  for (let key in values) {\n    if (!values.hasOwnProperty(key)) {\n      return;\n    }\n    if (values[key] === undefined) {\n      delete values[key];\n    }\n  }\n  return object[MODEL_VALUES_SYMBOL];\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/helpers.js?");

/***/ }),

/***/ "./ocpp/src/index.js":
/*!***************************!*\
  !*** ./ocpp/src/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CentralSystem\": () => (/* reexport safe */ _centralSystem_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]),\n/* harmony export */   \"ChargePoint\": () => (/* reexport safe */ _chargePoint_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]),\n/* harmony export */   \"Connector\": () => (/* reexport safe */ _connector_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]),\n/* harmony export */   \"OCPPCommands\": () => (/* reexport safe */ _commands_index_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _chargePoint_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chargePoint.js */ \"./ocpp/src/chargePoint.js\");\n/* harmony import */ var _centralSystem_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./centralSystem.js */ \"./ocpp/src/centralSystem.js\");\n/* harmony import */ var _connector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./connector.js */ \"./ocpp/src/connector.js\");\n/* harmony import */ var _commands_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./commands/index.js */ \"./ocpp/src/commands/index.js\");\n\n\n\n\n\n\n//# sourceURL=webpack://epp/./ocpp/src/index.js?");

/***/ }),

/***/ "./ocpp/src/logger.js":
/*!****************************!*\
  !*** ./ocpp/src/logger.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"LOGGER_URL\": () => (/* binding */ LOGGER_URL),\n/* harmony export */   \"default\": () => (/* binding */ Logger)\n/* harmony export */ });\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.js */ \"./ocpp/src/constants.js\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ws */ \"ws\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ws__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(_constants_js__WEBPACK_IMPORTED_MODULE_1__.DEBUG_LIBNAME);\nconst LOGGER_URL = '/logger.js';\nconst COUNT_MESSAGE_TO_STORE = 10;\nclass Logger {\n  constructor() {\n    this.sockets = [];\n    this.messages = [];\n  }\n  addSocket(socket) {\n    this.sockets.push(socket);\n    console.info('add');\n    socket.send(JSON.stringify({\n      command: 'history',\n      messages: this.messages\n    }));\n  }\n  debug(message) {\n    if (typeof message !== 'string') {\n      message = JSON.stringify(message);\n    }\n    this.messages.push(message);\n    if (this.messages.length > COUNT_MESSAGE_TO_STORE) {\n      this.messages = this.messages.slice(this.messages.length - COUNT_MESSAGE_TO_STORE, this.messages.length);\n    }\n    debug(message);\n    this.sendMessage({\n      command: 'message',\n      message\n    });\n  }\n  sendMessage(messageToSend) {\n    if (typeof messageToSend !== 'string') {\n      messageToSend = JSON.stringify(messageToSend);\n    }\n    for (let socket of this.sockets) {\n      if (socket.readyState === (ws__WEBPACK_IMPORTED_MODULE_2___default().OPEN)) {\n        socket.send(messageToSend);\n      }\n    }\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/logger.js?");

/***/ }),

/***/ "./ocpp/src/ocppError.js":
/*!*******************************!*\
  !*** ./ocpp/src/ocppError.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ERROR_FORMATIONVIOLATION\": () => (/* binding */ ERROR_FORMATIONVIOLATION),\n/* harmony export */   \"ERROR_GENERICERROR\": () => (/* binding */ ERROR_GENERICERROR),\n/* harmony export */   \"ERROR_INTERNALERROR\": () => (/* binding */ ERROR_INTERNALERROR),\n/* harmony export */   \"ERROR_NOTIMPLEMENTED\": () => (/* binding */ ERROR_NOTIMPLEMENTED),\n/* harmony export */   \"ERROR_NOTSUPPORTED\": () => (/* binding */ ERROR_NOTSUPPORTED),\n/* harmony export */   \"ERROR_OCCURENCECONSTRAINTVIOLATION\": () => (/* binding */ ERROR_OCCURENCECONSTRAINTVIOLATION),\n/* harmony export */   \"ERROR_PROPERTYCONSTRAINTVIOLATION\": () => (/* binding */ ERROR_PROPERTYCONSTRAINTVIOLATION),\n/* harmony export */   \"ERROR_PROTOCOLERROR\": () => (/* binding */ ERROR_PROTOCOLERROR),\n/* harmony export */   \"ERROR_SECURITYERROR\": () => (/* binding */ ERROR_SECURITYERROR),\n/* harmony export */   \"ERROR_TYPECONSTRAINTVIOLATION\": () => (/* binding */ ERROR_TYPECONSTRAINTVIOLATION),\n/* harmony export */   \"default\": () => (/* binding */ OCPPError)\n/* harmony export */ });\n// Requested Action is not known by receiver\nconst ERROR_NOTIMPLEMENTED = 'NotImplemented';\n\n// Requested Action is recognized but not supported by the receiver\nconst ERROR_NOTSUPPORTED = 'NotSupported';\n\n// An internal error occurred and the receiver was not able to process the requested Action successfully\nconst ERROR_INTERNALERROR = 'InternalError';\n\n// Payload for Action is incomplete\nconst ERROR_PROTOCOLERROR = 'ProtocolError';\n\n// During the processing of Action a security issue occurred preventing receiver from completing the Action successfully\nconst ERROR_SECURITYERROR = 'SecurityError';\n\n// Payload for Action is syntactically incorrect or not conform the PDU structure for Action\nconst ERROR_FORMATIONVIOLATION = 'FormationViolation';\n\n// Payload is syntactically correct but at least one field contains an invalid value\nconst ERROR_PROPERTYCONSTRAINTVIOLATION = 'PropertyConstraintViolation';\n\n// Payload for Action is syntactically correct but at least one of the fields violates occurence constraints\nconst ERROR_OCCURENCECONSTRAINTVIOLATION = 'OccurenceConstraintViolation';\n\n// Payload for Action is syntactically correct but at least one of the fields violates data type constraints (e.g. “somestring”: 12)\nconst ERROR_TYPECONSTRAINTVIOLATION = 'TypeConstraintViolation';\n\n// Any other error not covered by the previous ones\nconst ERROR_GENERICERROR = 'GenericError';\nclass OCPPError extends Error {\n  constructor(code, message, details) {\n    super(message);\n    this.code = code;\n    this.message = message;\n    this.details = details;\n    Object.setPrototypeOf(this, OCPPError.prototype); // for instanceof\n\n    Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack;\n  }\n}\n\n//# sourceURL=webpack://epp/./ocpp/src/ocppError.js?");

/***/ }),

/***/ "./routes/auth.routes.js":
/*!*******************************!*\
  !*** ./routes/auth.routes.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/auth.controller.js */ \"./controllers/auth.controller.js\");\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default().Router();\nrouter.route('/auth/signin').post(_controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].signin);\nrouter.route('/auth/signout').get(_controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].signout);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://epp/./routes/auth.routes.js?");

/***/ }),

/***/ "./routes/chargerPoint.routes.js":
/*!***************************************!*\
  !*** ./routes/chargerPoint.routes.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/auth.controller.js */ \"./controllers/auth.controller.js\");\n/* harmony import */ var _controllers_user_controller_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/user.controller.js */ \"./controllers/user.controller.js\");\n/* harmony import */ var _controllers_chargerPoint_controller_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../controllers/chargerPoint.controller.js */ \"./controllers/chargerPoint.controller.js\");\n\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default().Router();\nrouter.route('/ocpp/chargerPoints/status').get(_controllers_chargerPoint_controller_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].status);\nrouter.route('/ocpp/chargerPoints/clients').get(_controllers_chargerPoint_controller_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].clients);\nrouter.route('/ocpp/chargerPoints/:station').get(_controllers_chargerPoint_controller_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].read).put(_controllers_chargerPoint_controller_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].update).delete(_controllers_chargerPoint_controller_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].remove);\nrouter.route('/ocpp/chargerPoints/start/:userId').post(_controllers_chargerPoint_controller_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].remoteStart);\nrouter.route('/ocpp/chargerPoints').get(_controllers_chargerPoint_controller_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].list).post(_controllers_chargerPoint_controller_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].create);\nrouter.param('station', _controllers_chargerPoint_controller_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].chargerPointByID);\nrouter.param('userId', _controllers_user_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].userByID);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://epp/./routes/chargerPoint.routes.js?");

/***/ }),

/***/ "./routes/user.routes.js":
/*!*******************************!*\
  !*** ./routes/user.routes.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_user_controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/user.controller.js */ \"./controllers/user.controller.js\");\n/* harmony import */ var _controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/auth.controller.js */ \"./controllers/auth.controller.js\");\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default().Router();\nrouter.route('/api/users').get(_controllers_user_controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].list).post(_controllers_user_controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].create);\nrouter.route('/api/users/:userId').get(_controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_user_controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].read).put(_controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hasAuthorization, _controllers_user_controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].update).delete(_controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hasAuthorization, _controllers_user_controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].remove);\nrouter.param('userId', _controllers_user_controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].userByID);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://epp/./routes/user.routes.js?");

/***/ }),

/***/ "./server.js":
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"centralSystem\": () => (/* binding */ centralSystem)\n/* harmony export */ });\n/* harmony import */ var _config_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config/config.js */ \"./config/config.js\");\n/* harmony import */ var _express_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./express.js */ \"./express.js\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var ip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ip */ \"ip\");\n/* harmony import */ var ip__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ip__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _centralSystem_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./centralSystem.js */ \"./centralSystem.js\");\n\n\n\n\n//import WebSocket from \"ws\";\n\nprocess.on('uncaughtException', function (err) {\n  console.log('Caught exception: ' + err);\n});\nprocess.on('unhandledRejection', function (reason, p) {\n  console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);\n});\nconst server = (__webpack_require__(/*! http */ \"http\").createServer)(_express_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\nconst centralSystem = (0,_centralSystem_js__WEBPACK_IMPORTED_MODULE_4__.createServer)(server);\nconsole.log('%cserver.js line:22 centraSystem', 'color: #007acc;', centralSystem.options.wsOptions);\n\n// const wss = new WebSocket.Server({ server: server });\n// export { wss };\n// require(\"./ws\");\n\nserver.listen(_config_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].port, err => {\n  if (err) {\n    console.log(err);\n  }\n  console.info('Server started on %s.', ip__WEBPACK_IMPORTED_MODULE_3___default().address(), ':', _config_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].port);\n});\n(mongoose__WEBPACK_IMPORTED_MODULE_2___default().Promise) = global.Promise;\nmongoose__WEBPACK_IMPORTED_MODULE_2___default().connect(_config_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mongoUri, {\n  useNewUrlParser: true,\n  useCreateIndex: true,\n  useUnifiedTopology: true\n});\nmongoose__WEBPACK_IMPORTED_MODULE_2___default().connection.on('error', () => {\n  throw new Error(`unable to connect to database: ${_config_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mongoUri}`);\n});\n\n// import rune from './test'\n\n// rune()\n\n\n\n//# sourceURL=webpack://epp/./server.js?");

/***/ }),

/***/ "./sse.js":
/*!****************!*\
  !*** ./sse.js ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(req, res, next) {\n  res.sseSetup = function () {\n    res.writeHead(200, {\n      'Content-Type': 'text/event-stream',\n      'Cache-Control': 'no-cache',\n      Connection: 'keep-alive'\n    });\n  };\n  res.sseSend = function (data) {\n    res.write('data: ' + JSON.stringify(data) + '\\n\\n');\n  };\n  next();\n}\n;\n\n//# sourceURL=webpack://epp/./sse.js?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/***/ ((module) => {

module.exports = require("debug");

/***/ }),

/***/ "enjoi":
/*!************************!*\
  !*** external "enjoi" ***!
  \************************/
/***/ ((module) => {

module.exports = require("enjoi");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-jwt":
/*!******************************!*\
  !*** external "express-jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("express-jwt");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "ip":
/*!*********************!*\
  !*** external "ip" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("ip");

/***/ }),

/***/ "joi":
/*!**********************!*\
  !*** external "joi" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("joi");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ "lodash/extend.js":
/*!***********************************!*\
  !*** external "lodash/extend.js" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("lodash/extend.js");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("ws");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/Authorize.json":
/*!**********************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/Authorize.json ***!
  \**********************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"AuthorizeRequest\",\"type\":\"object\",\"properties\":{\"idTag\":{\"type\":\"string\",\"maxLength\":20}},\"additionalProperties\":false,\"required\":[\"idTag\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/Authorize.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/AuthorizeResponse.json":
/*!******************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/AuthorizeResponse.json ***!
  \******************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"AuthorizeResponse\",\"type\":\"object\",\"properties\":{\"idTagInfo\":{\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Blocked\",\"Expired\",\"Invalid\",\"ConcurrentTx\"]},\"expiryDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"parentIdTag\":{\"type\":\"string\",\"maxLength\":20}},\"required\":[\"status\"]}},\"additionalProperties\":false,\"required\":[\"idTagInfo\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/AuthorizeResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/BootNotification.json":
/*!*****************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/BootNotification.json ***!
  \*****************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"BootNotificationRequest\",\"type\":\"object\",\"properties\":{\"chargePointVendor\":{\"type\":\"string\",\"maxLength\":20},\"chargePointModel\":{\"type\":\"string\",\"maxLength\":20},\"chargePointSerialNumber\":{\"type\":\"string\",\"maxLength\":25},\"chargeBoxSerialNumber\":{\"type\":\"string\",\"maxLength\":25},\"firmwareVersion\":{\"type\":\"string\",\"maxLength\":50},\"iccid\":{\"type\":\"string\",\"maxLength\":20},\"imsi\":{\"type\":\"string\",\"maxLength\":20},\"meterType\":{\"type\":\"string\",\"maxLength\":25},\"meterSerialNumber\":{\"type\":\"string\",\"maxLength\":25}},\"additionalProperties\":false,\"required\":[\"chargePointVendor\",\"chargePointModel\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/BootNotification.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/BootNotificationResponse.json":
/*!*************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/BootNotificationResponse.json ***!
  \*************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"BootNotificationResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Pending\",\"Rejected\"]},\"currentTime\":{\"type\":\"string\",\"format\":\"date-time\"},\"interval\":{\"type\":\"number\"}},\"additionalProperties\":false,\"required\":[\"status\",\"currentTime\",\"interval\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/BootNotificationResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/CancelReservation.json":
/*!******************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/CancelReservation.json ***!
  \******************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"CancelReservationRequest\",\"type\":\"object\",\"properties\":{\"reservationId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"reservationId\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/CancelReservation.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/CancelReservationResponse.json":
/*!**************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/CancelReservationResponse.json ***!
  \**************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"CancelReservationResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/CancelReservationResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ChangeAvailability.json":
/*!*******************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ChangeAvailability.json ***!
  \*******************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ChangeAvailabilityRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"type\":{\"type\":\"string\",\"enum\":[\"Inoperative\",\"Operative\"]}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"type\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ChangeAvailability.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ChangeAvailabilityResponse.json":
/*!***************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ChangeAvailabilityResponse.json ***!
  \***************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ChangeAvailabilityResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\",\"Scheduled\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ChangeAvailabilityResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ChangeConfiguration.json":
/*!********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ChangeConfiguration.json ***!
  \********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ChangeConfigurationRequest\",\"type\":\"object\",\"properties\":{\"key\":{\"type\":\"string\",\"maxLength\":50},\"value\":{\"type\":\"string\",\"maxLength\":500}},\"additionalProperties\":false,\"required\":[\"key\",\"value\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ChangeConfiguration.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ChangeConfigurationResponse.json":
/*!****************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ChangeConfigurationResponse.json ***!
  \****************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ChangeConfigurationResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\",\"RebootRequired\",\"NotSupported\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ChangeConfigurationResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ClearCache.json":
/*!***********************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ClearCache.json ***!
  \***********************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ClearCacheRequest\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ClearCache.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ClearCacheResponse.json":
/*!*******************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ClearCacheResponse.json ***!
  \*******************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ClearCacheResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ClearCacheResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ClearChargingProfile.json":
/*!*********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ClearChargingProfile.json ***!
  \*********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ClearChargingProfileRequest\",\"type\":\"object\",\"properties\":{\"id\":{\"type\":\"integer\"},\"connectorId\":{\"type\":\"integer\"},\"chargingProfilePurpose\":{\"type\":\"string\",\"enum\":[\"ChargePointMaxProfile\",\"TxDefaultProfile\",\"TxProfile\"]},\"stackLevel\":{\"type\":\"integer\"}},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ClearChargingProfile.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ClearChargingProfileResponse.json":
/*!*****************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ClearChargingProfileResponse.json ***!
  \*****************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ClearChargingProfileResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Unknown\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ClearChargingProfileResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/DataTransfer.json":
/*!*************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/DataTransfer.json ***!
  \*************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"DataTransferRequest\",\"type\":\"object\",\"properties\":{\"vendorId\":{\"type\":\"string\",\"maxLength\":255},\"messageId\":{\"type\":\"string\",\"maxLength\":50},\"data\":{\"type\":\"string\"}},\"additionalProperties\":false,\"required\":[\"vendorId\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/DataTransfer.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/DataTransferResponse.json":
/*!*********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/DataTransferResponse.json ***!
  \*********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"DataTransferResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\",\"UnknownMessageId\",\"UnknownVendorId\"]},\"data\":{\"type\":\"string\"}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/DataTransferResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotification.json":
/*!******************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotification.json ***!
  \******************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"DiagnosticsStatusNotificationRequest\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Idle\",\"Uploaded\",\"UploadFailed\",\"Uploading\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotification.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse.json":
/*!**************************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse.json ***!
  \**************************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"DiagnosticsStatusNotificationResponse\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/DiagnosticsStatusNotificationResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/FirmwareStatusNotification.json":
/*!***************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/FirmwareStatusNotification.json ***!
  \***************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"FirmwareStatusNotificationRequest\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Downloaded\",\"DownloadFailed\",\"Downloading\",\"Idle\",\"InstallationFailed\",\"Installing\",\"Installed\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/FirmwareStatusNotification.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/FirmwareStatusNotificationResponse.json":
/*!***********************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/FirmwareStatusNotificationResponse.json ***!
  \***********************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"FirmwareStatusNotificationResponse\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/FirmwareStatusNotificationResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/GetCompositeSchedule.json":
/*!*********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/GetCompositeSchedule.json ***!
  \*********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetCompositeScheduleRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"duration\":{\"type\":\"integer\"},\"chargingRateUnit\":{\"type\":\"string\",\"enum\":[\"A\",\"W\"]}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"duration\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/GetCompositeSchedule.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/GetCompositeScheduleResponse.json":
/*!*****************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/GetCompositeScheduleResponse.json ***!
  \*****************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetCompositeScheduleResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]},\"connectorId\":{\"type\":\"integer\"},\"scheduleStart\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingSchedule\":{\"type\":\"object\",\"properties\":{\"duration\":{\"type\":\"integer\"},\"startSchedule\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingRateUnit\":{\"type\":\"string\",\"enum\":[\"A\",\"W\"]},\"chargingSchedulePeriod\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"startPeriod\":{\"type\":\"integer\"},\"limit\":{\"type\":\"number\",\"multipleOf\":0.1},\"numberPhases\":{\"type\":\"integer\"}},\"required\":[\"startPeriod\",\"limit\"]}},\"minChargingRate\":{\"type\":\"number\",\"multipleOf\":0.1}},\"required\":[\"chargingRateUnit\",\"chargingSchedulePeriod\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/GetCompositeScheduleResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/GetConfiguration.json":
/*!*****************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/GetConfiguration.json ***!
  \*****************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetConfigurationRequest\",\"type\":\"object\",\"properties\":{\"key\":{\"type\":\"array\",\"items\":{\"type\":\"string\",\"maxLength\":50}}},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/GetConfiguration.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/GetConfigurationResponse.json":
/*!*************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/GetConfigurationResponse.json ***!
  \*************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetConfigurationResponse\",\"type\":\"object\",\"properties\":{\"configurationKey\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"key\":{\"type\":\"string\",\"maxLength\":50},\"readonly\":{\"type\":\"boolean\"},\"value\":{\"type\":\"string\",\"maxLength\":500}},\"required\":[\"key\",\"readonly\"]}},\"unknownKey\":{\"type\":\"array\",\"items\":{\"type\":\"string\",\"maxLength\":50}}},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/GetConfigurationResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/GetDiagnostics.json":
/*!***************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/GetDiagnostics.json ***!
  \***************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetDiagnosticsRequest\",\"type\":\"object\",\"properties\":{\"location\":{\"type\":\"string\",\"format\":\"uri\"},\"retries\":{\"type\":\"integer\"},\"retryInterval\":{\"type\":\"integer\"},\"startTime\":{\"type\":\"string\",\"format\":\"date-time\"},\"stopTime\":{\"type\":\"string\",\"format\":\"date-time\"}},\"additionalProperties\":false,\"required\":[\"location\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/GetDiagnostics.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/GetDiagnosticsResponse.json":
/*!***********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/GetDiagnosticsResponse.json ***!
  \***********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetDiagnosticsResponse\",\"type\":\"object\",\"properties\":{\"fileName\":{\"type\":\"string\",\"maxLength\":255}},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/GetDiagnosticsResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/GetLocalListVersion.json":
/*!********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/GetLocalListVersion.json ***!
  \********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetLocalListVersionRequest\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/GetLocalListVersion.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/GetLocalListVersionResponse.json":
/*!****************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/GetLocalListVersionResponse.json ***!
  \****************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"GetLocalListVersionResponse\",\"type\":\"object\",\"properties\":{\"listVersion\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"listVersion\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/GetLocalListVersionResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/Heartbeat.json":
/*!**********************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/Heartbeat.json ***!
  \**********************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"HeartbeatRequest\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/Heartbeat.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/HeartbeatResponse.json":
/*!******************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/HeartbeatResponse.json ***!
  \******************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"HeartbeatResponse\",\"type\":\"object\",\"properties\":{\"currentTime\":{\"type\":\"string\",\"format\":\"date-time\"}},\"additionalProperties\":false,\"required\":[\"currentTime\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/HeartbeatResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/MeterValues.json":
/*!************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/MeterValues.json ***!
  \************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"MeterValuesRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"transactionId\":{\"type\":\"integer\"},\"meterValue\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"timestamp\":{\"type\":\"string\",\"format\":\"date-time\"},\"sampledValue\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"value\":{\"type\":\"string\"},\"context\":{\"type\":\"string\",\"enum\":[\"Interruption.Begin\",\"Interruption.End\",\"Sample.Clock\",\"Sample.Periodic\",\"Transaction.Begin\",\"Transaction.End\",\"Trigger\",\"Other\"]},\"format\":{\"type\":\"string\",\"enum\":[\"Raw\",\"SignedData\"]},\"measurand\":{\"type\":\"string\",\"enum\":[\"Energy.Active.Export.Register\",\"Energy.Active.Import.Register\",\"Energy.Reactive.Export.Register\",\"Energy.Reactive.Import.Register\",\"Energy.Active.Export.Interval\",\"Energy.Active.Import.Interval\",\"Energy.Reactive.Export.Interval\",\"Energy.Reactive.Import.Interval\",\"Power.Active.Export\",\"Power.Active.Import\",\"Power.Offered\",\"Power.Reactive.Export\",\"Power.Reactive.Import\",\"Power.Factor\",\"Current.Import\",\"Current.Export\",\"Current.Offered\",\"Voltage\",\"Frequency\",\"Temperature\",\"SoC\",\"RPM\"]},\"phase\":{\"type\":\"string\",\"enum\":[\"L1\",\"L2\",\"L3\",\"N\",\"L1-N\",\"L2-N\",\"L3-N\",\"L1-L2\",\"L2-L3\",\"L3-L1\"]},\"location\":{\"type\":\"string\",\"enum\":[\"Cable\",\"EV\",\"Inlet\",\"Outlet\",\"Body\"]},\"unit\":{\"type\":\"string\",\"enum\":[\"Wh\",\"kWh\",\"varh\",\"kvarh\",\"W\",\"kW\",\"VA\",\"kVA\",\"var\",\"kvar\",\"A\",\"V\",\"K\",\"Celcius\",\"Fahrenheit\",\"Percent\"]}},\"required\":[\"value\"]}}},\"required\":[\"timestamp\",\"sampledValue\"]}}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"meterValue\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/MeterValues.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/MeterValuesResponse.json":
/*!********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/MeterValuesResponse.json ***!
  \********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"MeterValuesResponse\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/MeterValuesResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/RemoteStartTransaction.json":
/*!***********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/RemoteStartTransaction.json ***!
  \***********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"RemoteStartTransactionRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"idTag\":{\"type\":\"string\",\"maxLength\":20},\"chargingProfile\":{\"type\":\"object\",\"properties\":{\"chargingProfileId\":{\"type\":\"integer\"},\"transactionId\":{\"type\":\"integer\"},\"stackLevel\":{\"type\":\"integer\"},\"chargingProfilePurpose\":{\"type\":\"string\",\"enum\":[\"ChargePointMaxProfile\",\"TxDefaultProfile\",\"TxProfile\"]},\"chargingProfileKind\":{\"type\":\"string\",\"enum\":[\"Absolute\",\"Recurring\",\"Relative\"]},\"recurrencyKind\":{\"type\":\"string\",\"enum\":[\"Daily\",\"Weekly\"]},\"validFrom\":{\"type\":\"string\",\"format\":\"date-time\"},\"validTo\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingSchedule\":{\"type\":\"object\",\"properties\":{\"duration\":{\"type\":\"integer\"},\"startSchedule\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingRateUnit\":{\"type\":\"string\",\"enum\":[\"A\",\"W\"]},\"chargingSchedulePeriod\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"startPeriod\":{\"type\":\"integer\"},\"limit\":{\"type\":\"number\",\"multipleOf\":0.1},\"numberPhases\":{\"type\":\"integer\"}},\"required\":[\"startPeriod\",\"limit\"]}},\"minChargingRate\":{\"type\":\"number\",\"multipleOf\":0.1}},\"required\":[\"chargingRateUnit\",\"chargingSchedulePeriod\"]}},\"required\":[\"chargingProfileId\",\"stackLevel\",\"chargingProfilePurpose\",\"chargingProfileKind\",\"chargingSchedule\"]}},\"additionalProperties\":false,\"required\":[\"idTag\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/RemoteStartTransaction.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/RemoteStartTransactionResponse.json":
/*!*******************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/RemoteStartTransactionResponse.json ***!
  \*******************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"RemoteStartTransactionResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/RemoteStartTransactionResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/RemoteStopTransaction.json":
/*!**********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/RemoteStopTransaction.json ***!
  \**********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"RemoteStopTransactionRequest\",\"type\":\"object\",\"properties\":{\"transactionId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"transactionId\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/RemoteStopTransaction.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/RemoteStopTransactionResponse.json":
/*!******************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/RemoteStopTransactionResponse.json ***!
  \******************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"RemoteStopTransactionResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/RemoteStopTransactionResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ReserveNow.json":
/*!***********************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ReserveNow.json ***!
  \***********************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ReserveNowRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"expiryDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"idTag\":{\"type\":\"string\",\"maxLength\":20},\"parentIdTag\":{\"type\":\"string\",\"maxLength\":20},\"reservationId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"expiryDate\",\"idTag\",\"reservationId\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ReserveNow.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ReserveNowResponse.json":
/*!*******************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ReserveNowResponse.json ***!
  \*******************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ReserveNowResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Faulted\",\"Occupied\",\"Rejected\",\"Unavailable\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ReserveNowResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/Reset.json":
/*!******************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/Reset.json ***!
  \******************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ResetRequest\",\"type\":\"object\",\"properties\":{\"type\":{\"type\":\"string\",\"enum\":[\"Hard\",\"Soft\"]}},\"additionalProperties\":false,\"required\":[\"type\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/Reset.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/ResetResponse.json":
/*!**************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/ResetResponse.json ***!
  \**************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"ResetResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/ResetResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/SendLocalList.json":
/*!**************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/SendLocalList.json ***!
  \**************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"SendLocalListRequest\",\"type\":\"object\",\"properties\":{\"listVersion\":{\"type\":\"integer\"},\"localAuthorizationList\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"idTag\":{\"type\":\"string\",\"maxLength\":20},\"idTagInfo\":{\"type\":\"object\",\"properties\":{\"expiryDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"parentIdTag\":{\"type\":\"string\",\"maxLength\":20},\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Blocked\",\"Expired\",\"Invalid\",\"ConcurrentTx\"]}},\"required\":[\"status\"]}},\"required\":[\"idTag\"]}},\"updateType\":{\"type\":\"string\",\"enum\":[\"Differential\",\"Full\"]}},\"additionalProperties\":false,\"required\":[\"listVersion\",\"updateType\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/SendLocalList.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/SendLocalListResponse.json":
/*!**********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/SendLocalListResponse.json ***!
  \**********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"SendLocalListResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Failed\",\"NotSupported\",\"VersionMismatch\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/SendLocalListResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/SetChargingProfile.json":
/*!*******************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/SetChargingProfile.json ***!
  \*******************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"SetChargingProfileRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"csChargingProfiles\":{\"type\":\"object\",\"properties\":{\"chargingProfileId\":{\"type\":\"integer\"},\"transactionId\":{\"type\":\"integer\"},\"stackLevel\":{\"type\":\"integer\"},\"chargingProfilePurpose\":{\"type\":\"string\",\"enum\":[\"ChargePointMaxProfile\",\"TxDefaultProfile\",\"TxProfile\"]},\"chargingProfileKind\":{\"type\":\"string\",\"enum\":[\"Absolute\",\"Recurring\",\"Relative\"]},\"recurrencyKind\":{\"type\":\"string\",\"enum\":[\"Daily\",\"Weekly\"]},\"validFrom\":{\"type\":\"string\",\"format\":\"date-time\"},\"validTo\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingSchedule\":{\"type\":\"object\",\"properties\":{\"duration\":{\"type\":\"integer\"},\"startSchedule\":{\"type\":\"string\",\"format\":\"date-time\"},\"chargingRateUnit\":{\"type\":\"string\",\"enum\":[\"A\",\"W\"]},\"chargingSchedulePeriod\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"startPeriod\":{\"type\":\"integer\"},\"limit\":{\"type\":\"number\",\"multipleOf\":0.1},\"numberPhases\":{\"type\":\"integer\"}},\"required\":[\"startPeriod\",\"limit\"]}},\"minChargingRate\":{\"type\":\"number\",\"multipleOf\":0.1}},\"required\":[\"chargingRateUnit\",\"chargingSchedulePeriod\"]}},\"required\":[\"chargingProfileId\",\"stackLevel\",\"chargingProfilePurpose\",\"chargingProfileKind\",\"chargingSchedule\"]}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"csChargingProfiles\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/SetChargingProfile.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/SetChargingProfileResponse.json":
/*!***************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/SetChargingProfileResponse.json ***!
  \***************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"SetChargingProfileResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\",\"NotSupported\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/SetChargingProfileResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/StartTransaction.json":
/*!*****************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/StartTransaction.json ***!
  \*****************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StartTransactionRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"idTag\":{\"type\":\"string\",\"maxLength\":20},\"meterStart\":{\"type\":\"integer\"},\"reservationId\":{\"type\":\"integer\"},\"timestamp\":{\"type\":\"string\",\"format\":\"date-time\"}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"idTag\",\"meterStart\",\"timestamp\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/StartTransaction.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/StartTransactionResponse.json":
/*!*************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/StartTransactionResponse.json ***!
  \*************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StartTransactionResponse\",\"type\":\"object\",\"properties\":{\"idTagInfo\":{\"type\":\"object\",\"properties\":{\"expiryDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"parentIdTag\":{\"type\":\"string\",\"maxLength\":20},\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Blocked\",\"Expired\",\"Invalid\",\"ConcurrentTx\"]}},\"required\":[\"status\"]},\"transactionId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"idTagInfo\",\"transactionId\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/StartTransactionResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/StatusNotification.json":
/*!*******************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/StatusNotification.json ***!
  \*******************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StatusNotificationRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"},\"errorCode\":{\"type\":\"string\",\"enum\":[\"ConnectorLockFailure\",\"EVCommunicationError\",\"GroundFailure\",\"HighTemperature\",\"InternalError\",\"LocalListConflict\",\"NoError\",\"OtherError\",\"OverCurrentFailure\",\"PowerMeterFailure\",\"PowerSwitchFailure\",\"ReaderFailure\",\"ResetFailure\",\"UnderVoltage\",\"OverVoltage\",\"WeakSignal\"]},\"info\":{\"type\":\"string\",\"maxLength\":50},\"status\":{\"type\":\"string\",\"enum\":[\"Available\",\"Preparing\",\"Charging\",\"SuspendedEVSE\",\"SuspendedEV\",\"Finishing\",\"Reserved\",\"Unavailable\",\"Faulted\"]},\"timestamp\":{\"type\":\"string\",\"format\":\"date-time\"},\"vendorId\":{\"type\":\"string\",\"maxLength\":255},\"vendorErrorCode\":{\"type\":\"string\",\"maxLength\":50}},\"additionalProperties\":false,\"required\":[\"connectorId\",\"errorCode\",\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/StatusNotification.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/StatusNotificationResponse.json":
/*!***************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/StatusNotificationResponse.json ***!
  \***************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StatusNotificationResponse\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/StatusNotificationResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/StopTransaction.json":
/*!****************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/StopTransaction.json ***!
  \****************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StopTransactionRequest\",\"type\":\"object\",\"properties\":{\"idTag\":{\"type\":\"string\",\"maxLength\":20},\"meterStop\":{\"type\":\"integer\"},\"timestamp\":{\"type\":\"string\",\"format\":\"date-time\"},\"transactionId\":{\"type\":\"integer\"},\"reason\":{\"type\":\"string\",\"enum\":[\"EmergencyStop\",\"EVDisconnected\",\"HardReset\",\"Local\",\"Other\",\"PowerLoss\",\"Reboot\",\"Remote\",\"SoftReset\",\"UnlockCommand\",\"DeAuthorized\"]},\"transactionData\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"timestamp\":{\"type\":\"string\",\"format\":\"date-time\"},\"sampledValue\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"value\":{\"type\":\"string\"},\"context\":{\"type\":\"string\",\"enum\":[\"Interruption.Begin\",\"Interruption.End\",\"Sample.Clock\",\"Sample.Periodic\",\"Transaction.Begin\",\"Transaction.End\",\"Trigger\",\"Other\"]},\"format\":{\"type\":\"string\",\"enum\":[\"Raw\",\"SignedData\"]},\"measurand\":{\"type\":\"string\",\"enum\":[\"Energy.Active.Export.Register\",\"Energy.Active.Import.Register\",\"Energy.Reactive.Export.Register\",\"Energy.Reactive.Import.Register\",\"Energy.Active.Export.Interval\",\"Energy.Active.Import.Interval\",\"Energy.Reactive.Export.Interval\",\"Energy.Reactive.Import.Interval\",\"Power.Active.Export\",\"Power.Active.Import\",\"Power.Offered\",\"Power.Reactive.Export\",\"Power.Reactive.Import\",\"Power.Factor\",\"Current.Import\",\"Current.Export\",\"Current.Offered\",\"Voltage\",\"Frequency\",\"Temperature\",\"SoC\",\"RPM\"]},\"phase\":{\"type\":\"string\",\"enum\":[\"L1\",\"L2\",\"L3\",\"N\",\"L1-N\",\"L2-N\",\"L3-N\",\"L1-L2\",\"L2-L3\",\"L3-L1\"]},\"location\":{\"type\":\"string\",\"enum\":[\"Cable\",\"EV\",\"Inlet\",\"Outlet\",\"Body\"]},\"unit\":{\"type\":\"string\",\"enum\":[\"Wh\",\"kWh\",\"varh\",\"kvarh\",\"W\",\"kW\",\"VA\",\"kVA\",\"var\",\"kvar\",\"A\",\"V\",\"K\",\"Celcius\",\"Fahrenheit\",\"Percent\"]}},\"required\":[\"value\"]}}},\"required\":[\"timestamp\",\"sampledValue\"]}}},\"additionalProperties\":false,\"required\":[\"transactionId\",\"timestamp\",\"meterStop\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/StopTransaction.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/StopTransactionResponse.json":
/*!************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/StopTransactionResponse.json ***!
  \************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"StopTransactionResponse\",\"type\":\"object\",\"properties\":{\"idTagInfo\":{\"type\":\"object\",\"properties\":{\"expiryDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"parentIdTag\":{\"type\":\"string\",\"maxLength\":20},\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Blocked\",\"Expired\",\"Invalid\",\"ConcurrentTx\"]}},\"required\":[\"status\"]}},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/StopTransactionResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/TriggerMessage.json":
/*!***************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/TriggerMessage.json ***!
  \***************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"TriggerMessageRequest\",\"type\":\"object\",\"properties\":{\"requestedMessage\":{\"type\":\"string\",\"enum\":[\"BootNotification\",\"DiagnosticsStatusNotification\",\"FirmwareStatusNotification\",\"Heartbeat\",\"MeterValues\",\"StatusNotification\"]},\"connectorId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"requestedMessage\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/TriggerMessage.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/TriggerMessageResponse.json":
/*!***********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/TriggerMessageResponse.json ***!
  \***********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"TriggerMessageResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Accepted\",\"Rejected\",\"NotImplemented\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/TriggerMessageResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/UnlockConnector.json":
/*!****************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/UnlockConnector.json ***!
  \****************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"UnlockConnectorRequest\",\"type\":\"object\",\"properties\":{\"connectorId\":{\"type\":\"integer\"}},\"additionalProperties\":false,\"required\":[\"connectorId\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/UnlockConnector.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/UnlockConnectorResponse.json":
/*!************************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/UnlockConnectorResponse.json ***!
  \************************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"UnlockConnectorResponse\",\"type\":\"object\",\"properties\":{\"status\":{\"type\":\"string\",\"enum\":[\"Unlocked\",\"UnlockFailed\",\"NotSupported\"]}},\"additionalProperties\":false,\"required\":[\"status\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/UnlockConnectorResponse.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/UpdateFirmware.json":
/*!***************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/UpdateFirmware.json ***!
  \***************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"UpdateFirmwareRequest\",\"type\":\"object\",\"properties\":{\"location\":{\"type\":\"string\",\"format\":\"uri\"},\"retries\":{\"type\":\"number\"},\"retrieveDate\":{\"type\":\"string\",\"format\":\"date-time\"},\"retryInterval\":{\"type\":\"number\"}},\"additionalProperties\":false,\"required\":[\"location\",\"retrieveDate\"]}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/UpdateFirmware.json?");

/***/ }),

/***/ "./ocpp/ocpp-1.6-schemas/UpdateFirmwareResponse.json":
/*!***********************************************************!*\
  !*** ./ocpp/ocpp-1.6-schemas/UpdateFirmwareResponse.json ***!
  \***********************************************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"$schema\":\"http://json-schema.org/draft-04/schema#\",\"title\":\"UpdateFirmwareResponse\",\"type\":\"object\",\"properties\":{},\"additionalProperties\":false}');\n\n//# sourceURL=webpack://epp/./ocpp/ocpp-1.6-schemas/UpdateFirmwareResponse.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./server.js");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;