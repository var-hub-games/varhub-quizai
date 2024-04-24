function e(e,n,t,r){Object.defineProperty(e,n,{get:t,set:r,enumerable:!0,configurable:!0})}(0,globalThis.parcelRequirec950.register)("dcDWS",function(n,t){e(n.exports,"roomIntegrity",()=>r),e(n.exports,"roomModule",()=>o);let r="191871fd81755271b4e7e336d29270aa8a1dca796b68a5676606b1680c183531",o={main:"index.js",source:{"index.js":'var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError("Generator is already executing.");\n        while (g && (g = 0, op[0] && (_ = 0)), _) try {\n            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nimport room from "varhub:room";\nimport config from "varhub:config";\nimport network from "varhub:api/network";\nvar correctAnswerIndex = -1;\nvar currentAnswers = {};\nvar state = {\n    currentQuiz: null,\n    scoreMap: {},\n    answeredPlayers: [],\n    correctAnswerIndex: null,\n    phase: "idle",\n    config: config\n};\nexport function getConfig() {\n    return config;\n}\nexport function getState() {\n    return state;\n}\nexport function updateState() {\n    room.broadcast("state", state);\n}\nvar chatGptUrl = config["chatGptUrl"];\nfunction requestChatGPTQuiz() {\n    return __awaiter(this, arguments, void 0, function (subject) {\n        var request, response;\n        if (subject === void 0) { subject = "случайная тема"; }\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    request = {\n                        "modelName": "gpt-4",\n                        "nsfwBlock": false,\n                        "context": [\n                            { "role": "system", "message": "Ты помощник, который получает сообщение - тему, и формирует викторину на эту тему. Ответ нужно выдать в JSON в следующем формате: \\"{question, answers, correctAnswerIndex}\\"" },\n                            { "role": "user", "message": subject }\n                        ]\n                    };\n                    return [4, network.fetch(chatGptUrl, {\n                            headers: { "Content-Type": "application/json" },\n                            body: JSON.stringify(request),\n                            method: "post",\n                            type: "json"\n                        })];\n                case 1:\n                    response = _a.sent();\n                    return [2, JSON.parse(response.body.result[0].result.replace(/(```|\\n)/g, "").replace("json{", "{"))];\n            }\n        });\n    });\n}\nexport function requestNewQuestion(subject) {\n    return __awaiter(this, void 0, void 0, function () {\n        var question;\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    if (state.phase !== "idle" && state.phase !== "results")\n                        return [2];\n                    currentAnswers = {};\n                    state.answeredPlayers = [];\n                    state.correctAnswerIndex = null;\n                    state.currentQuiz = null;\n                    state.phase = "pending";\n                    state.currentSubject = subject;\n                    updateState();\n                    return [4, requestChatGPTQuiz(subject)];\n                case 1:\n                    question = _a.sent();\n                    correctAnswerIndex = question.correctAnswerIndex;\n                    delete question["correctAnswerIndex"];\n                    state.currentQuiz = question;\n                    state.phase = "question";\n                    updateState();\n                    return [2];\n            }\n        });\n    });\n}\nfunction checkAllPlayersAnswered() {\n    return room.getPlayers().every(function (it) { return state.answeredPlayers.indexOf(it) >= 0; });\n}\nfunction updateScores() {\n    for (var _i = 0, _a = Object.entries(currentAnswers); _i < _a.length; _i++) {\n        var _b = _a[_i], player = _b[0], answer_1 = _b[1];\n        if (correctAnswerIndex === answer_1)\n            state.scoreMap[player] = (state.scoreMap[player] || 0) + 1;\n    }\n}\nexport function answer(index) {\n    if (state.phase !== "question") {\n        throw new Error("You can only answer in question phase");\n    }\n    if (this.player in currentAnswers) {\n        throw new Error("You can\'t answer again");\n    }\n    currentAnswers[this.player] = index;\n    state.answeredPlayers.push(this.player);\n    if (checkAllPlayersAnswered()) {\n        state.phase = "results";\n        state.correctAnswerIndex = correctAnswerIndex;\n        updateScores();\n    }\n    updateState();\n}\n'}}});
//# sourceMappingURL=.varhub-modules.aW5kZXgudHM=.3f29fbeb.js.map