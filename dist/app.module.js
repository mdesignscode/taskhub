"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _appcontroller = require("./app.controller");
const _appservice = require("./app.service");
const _authmodule = require("./auth/auth.module");
const _usersmodule = require("./users/users.module");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _config = require("@nestjs/config");
const _joi = /*#__PURE__*/ _interop_require_default(require("joi"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AppModule = class AppModule {
    constructor(dataSource){
        this.dataSource = dataSource;
    }
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'test_user',
                password: 'test_password',
                database: 'test_database',
                synchronize: true,
                autoLoadEntities: true
            }),
            _authmodule.AuthModule,
            _usersmodule.UsersModule,
            _config.ConfigModule.forRoot({
                validationSchema: _joi.default.object({
                    JWT_SECRET: _joi.default.string()
                })
            })
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService
        ]
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], AppModule);

//# sourceMappingURL=app.module.js.map