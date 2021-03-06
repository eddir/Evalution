let enabled, width, height, goods_random, spawn_random, news_limit, spawn_limit, period, alphabet, interval, start_points, player;

let area = [[]], name = 0x1, stat_food = 0, stat_kill = 0;

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

if (mobileCheck()) {
    confirm("Простите, симулятор всё ещё не поддерживает мобильные устройства.");
}

function playerMovement(x, y) {
    if (area[x][y]['type'] === 'point') {
        player['entity']['hungry'] = 0;
        stat_food++;
        let points = getRandomInt(3) + 2;
        player['entity']['points'] += points;
        broadCastPlayerEat(points);
    } else if (area[x][y]['type'] === 'creation') {
        return fighting(x, y, player['entity']);
    }
    if (player['entity']['hungry'] > player['entity']['endurance']) {
        player['entity']['endurance']++;
    }
    if (player['entity']['points'] === 0) {
        gameOver("Закончились очки движения");
    }
    return true;
}

function tick() {
    steps();
    spawn();
    fillGoods();
    draw();
}

function startGame() {
    width = document.getElementById("width").value;
    height = document.getElementById("height").value;
    goods_random = document.getElementById("goods_random").value;
    spawn_random = document.getElementById("spawn_random").value;
    news_limit = document.getElementById("news_limit").value;
    spawn_limit = document.getElementById("spawn_limit").value;
    period = document.getElementById("period").value;
    alphabet = document.getElementById("alphabet").value;
    start_points = document.getElementById("start_points").value;

    document.getElementById("welcome").hidden = true;
    document.getElementById("news_block").classList.remove("hidden");

    for (let i = 0; i < height; i++) {
        area[i] = [];
        for (let k = 0; k < width; k++) {
            area[i][k] = {type: "empty"};
        }
    }

    player = {
        x: width / 2 | 0,
        y: height / 2 | 0,
        entity: {
            name: "Игрок",
            type: "player",
            status: 3,
            parents: [0, 0],
            points: start_points,
            age: 0,
            eye: 1,
            gen: -1,
            step: 1,
            hungry: 0,
            endurance: 0,
            power: 0,
            skin: 15
        }
    };
    area[player['y']][player['x']] = player['entity'];

    resumeGame();

    document.addEventListener('keypress', (event) => {
        let px = player['x'];
        let py = player['y'];
        switch (event.code) {
            case "KeyW": //движение вперёд
                if (enabled && player['x'] !== 0 && playerMovement(player['x'] - 1, player['y'])) {
                    player['x']--;
                    moveCreation([px, py], [player['x'], player['y']], 1);
                    draw();
                }
                break;
            case "KeyS": //движение назад
                if (enabled && player['x'] !== height - 1 && playerMovement(player['x'] + 1, player['y'])) {
                    player['x']++;
                    moveCreation([px, py], [player['x'], player['y']], 1);
                    draw();
                }
                break;
            case "KeyA": //движение влево
                if (enabled && player['y'] !== 0 && playerMovement(player['x'], player['y'] - 1)) {
                    player['y']--;
                    moveCreation([px, py], [player['x'], player['y']], 1);
                    draw();
                }
                break;
            case "KeyD": //движение вправо
                if (enabled && player['y'] !== width - 1 && playerMovement(player['x'], player['y'] + 1)) {
                    player['y']++;
                    moveCreation([px, py], [player['x'], player['y']], 1);
                    draw();
                }
                break;
            case "KeyP": //пауза\продолжить
                if (enabled) {
                    stopGame();
                    console.log("Paused");
                } else {
                    resumeGame();
                    console.log("Resumed");
                }
                break;
            case "KeyF": //тик быстрее
                if (enabled && period > 100) {
                    period -= 100;
                    clearInterval(interval);
                    interval = setInterval(tick, period);
                    console.log("Changed period to " + period);
                }
                break;
            case "KeyL": //тик медленее
                if (enabled) {
                    period += 100;
                    clearInterval(interval);
                    interval = setInterval(tick, period);
                    console.log("Changed period to " + period);
                }
                break;
        }
    });
}

function gameOver(message) {
    stopGame();
    document.getElementById("welcome").style.display = 'none';
    document.getElementById("area").style.display = 'none';
    modal("<h1>Поражение</h1><h2>" + message + "</h2><p>Возраст: " +
        player['entity']['age'] + "</p><p>Съедено: " + stat_food + "</p><p>Убито: " + stat_kill + "</p>");
}
function gameWin(message) {
    stopGame();
    document.getElementById("welcome").style.display = 'none';
    document.getElementById("area").style.display = 'none';
    modal("<h1>Победа</h1><h2>" + message + "</h2><p>Возраст: " +
        player['entity']['age'] + "</p><p>Съедено: " + stat_food + "</p><p>Убито: " + stat_kill + "</p>");
}

function stopGame() {
    clearInterval(interval);
    enabled = 0;
}

function resumeGame() {
    tick();
    interval = setInterval(tick, period);
    enabled = 1;
}

function spawn() {
    if (name < spawn_limit && getRandomInt(100) < spawn_random) {
        let x = getRandomInt(width);
        let y = getRandomInt(height);
        while (area[y][x]['type'] !== "empty") {
            x++;
            if (x === width) {
                x = 0;
                y++;
            }
            if (y === height) {
                y = 0;
                x = 0;
            }
        }
        area[y][x] = {
            name: (name++).toString(alphabet),
            type: "creation",
            status: 3,
            parents: [0, 0],
            points: start_points,
            age: 0,
            eye: 1,
            gen: getRandomInt(10),
            step: 1,
            hungry: 0,
            endurance: 0,
            power: 0,
            skin: getRandomInt(14)
        };
        broadCastResurrection(area[y][x]);
    }
}

function steps() {
    let creatures = getCreatures();
    for (let i = 0; i < creatures.length; i++) {
        doStep(creatures[i][0], creatures[i][1]);
    }

    player['entity']['age']++;
    player['entity']['hungry']++;
    if (player['entity']['points'] > 4 && getRandomInt(6) === 1) {
        player['entity']['power']++;
        player['entity']['points'] -= 4;
        popup("Увеличена сила. -4 очки.")
    }
}

function doStep(x, y) {
    let creation = area[x][y];
    area[x][y]['age']++;
    area[x][y]['status'] = 0;
    if (creation['points'] > 1) {
        if (creation['eye'] > 0) {
            if (getRandomInt(creation['endurance']) < creation['hungry']) {
                if (fighting(x, y, creation)) {
                    return;
                }
            }
            if (getRandomInt(creation['endurance']) < creation['power']) {
                if (loving(x, y, creation)) {
                    return;
                }
            }
            if (area[x][y]['points'] > 4 && getRandomInt(6) === 1) {
                area[x][y]['power']++;
                area[x][y]['points'] -= 4;
                return;
            }
            let environment = searching(x, y, creation);
            if (environment !== true) {
                switch (getRandomInt(4)) {
                    case 0:
                        let position = environment[getRandomInt(environment.length)];
                        moveCreation([x, y], [position[0], position[1]], creation['step']);
                        break;
                    case 1:
                        if (area[x][y]['points'] > 3) {
                            area[x][y]['eye']++;
                            area[x][y]['points'] -= 3;
                        }
                        break;
                    case 3:
                        //лень вырабатывается
                        area[x][y]['endurance']--;
                        break;
                }

            }
        }
    } else {
        area[x][y]['eye'] = 1;
        if (searching(x, y, area[x][y]) !== true) {
            area[x][y]['hungry']++;
            if (area[x][y]['hungry'] > area[x][y]['endurance']) {
                area[x][y]['endurance']++;
            }
        }
    }
}

function loving(x, y, creation) {
    let radius;
    creation['eye'] <= creation['step'] ? radius = creation['eye'] : radius = creation['step'];
    let environment = shuffle(getAround(x, y, radius));
    for (let i = 0; i < environment.length; i++) {
        if (area[environment[i][0]][environment[i][1]]['type'] === "creation" &&
            area[environment[i][0]][environment[i][1]]['gen'] !== area[x][y]['gen'] &&
            area[environment[i][0]][environment[i][1]]['points'] > 4 &&
            getRandomInt(1) === 0
        ) {
            let vx = environment[i][0];
            let vy = environment[i][1];

            for (let j = 0; j < environment.length; j++) {
                if (area[environment[j][0]][environment[j][1]]['type'] === "empty") {
                    let bx = environment[j][0];
                    let by = environment[j][1];
                    area[bx][by] = {
                        name: name++,
                        parents: [area[x][y]['name'], area[vx][vy]['name']],
                        status: 0,
                        type: "creation",
                        points: Math.ceil((area[vx][vy]['points']) / 4),
                        age: 0,
                        eye: Math.floor((area[vx][vy]['eye'] + area[x][y]['points']) / 2),
                        gen: area[x][y]['gen'],
                        step: 1,
                        hungry: 0,
                        endurance: area[vx][vy]['endurance'],
                        power: 0
                    };
                    broadCastBirth(area[bx][by]);
                    area[x][y]['status'] = area[vx][vy]['status'] = 1;
                    area[vx][vy]['points'] -= 4;
                    break;
                }
            }
            return true;
        }
    }
    return false;
}

function searching(x, y, creation) {
    let environment = shuffle(getAround(x, y, creation['eye']));
    for (let i = 0; i < environment.length; i++) {
        if (area[environment[i][0]][environment[i][1]]['type'] === "point") {
            let to = moveCreation([x, y], [environment[i][0], environment[i][1]], creation['step']);
            if (to['type'] === "point") {
                area[environment[i][0]][environment[i][1]]['points'] += getRandomInt(3) + 2;
                area[environment[i][0]][environment[i][1]]['hungry'] = 0;
            }
            return true;
        }
    }
    return environment;
}

function fighting(x, y, creation) {
    let radius;
    creation['eye'] <= creation['step'] ? radius = creation['eye'] : radius = creation['step'];
    let environment = shuffle(getAround(x, y, radius));
    for (let i = 0; i < environment.length; i++) {
        if (area[environment[i][0]][environment[i][1]]['type'] === "creation" || area[environment[i][0]][environment[i][1]]['type'] === "player") {
            let vx = environment[i][0];
            let vy = environment[i][1];

            if ((area[x][y]['power'] + area[x][y]['points']) > (area[vx][vy]['power'] + area[vx][vy]['points'])) {
                broadCastDeath(area[x][y], area[vx][vy]);
                area[x][y]['points'] += area[vx][vy]['points'];
                area[x][y]['power'] = Math.floor(getRandomInt(110) / 100 * area[x][y]['power']);
                moveCreation([x, y], [vx, vy], radius);
                area[x][y]['status'] = 2;
            } else {
                broadCastDeath(area[vx][vy], area[x][y]);
                area[vx][vy]['points'] += area[x][y]['points'];
                area[vx][vy]['power'] = Math.floor(getRandomInt(150) / 100 * area[vx][vy]['power']);
                area[x][y] = {type: "empty"};
                area[vx][vy]['status'] = 2;
            }
            return true;
        }
    }
    return false;
}

function broadCastPlayerEat(points) {
    popup("+" + points + " очков движения. Всего " + player['entity']['points'] + ".");
}

function broadCastResurrection(creation) {
    document.getElementById("news").innerHTML = "<div><h2>Новое существо</h2><p>Имя: #" + creation['name'] +
        "<br>Родители: #" + creation['parents'][0] + ", #" + creation['parents'][1] + "<br>Зрение: " + creation['eye'] +
        "<br>Выносливость: " + creation['endurance'] + "<br>Ген: " + creation['gen'] +
        "<br>Всего существ: " + countCreations() + "</p><hr></div>" + document.getElementById("news").innerHTML;
    limitNews();
}

function broadCastDeath(killer, victim) {
    if (victim['type'] === "player") {
        gameOver("Вас убили.");
    } else if (killer['type'] === "player") {
        stat_kill++;
        popup("Убийто существо " + victim['name'] + ", очков всего " + player['entity']['points']);
    }
    document.getElementById("news").innerHTML = "<div><h2>Смерть</h2><p>Убит: " + victim['name'] +
        "(" + victim['points'] + ", " + victim['power'] + ")" + "<br>Убийца: " + killer['name'] + "(" +
        killer['points'] + ", " + killer['power'] + ")<br>Всего существ: " + countCreations() + "</p><hr></div>" +
        document.getElementById("news").innerHTML;

    if (countCreations() === 1) {
        gameWin("Не осталось существ");
    }

    limitNews();
}

function broadCastBirth(creation) {
    document.getElementById("news").innerHTML = "<div><h2>Рождение</h2><p>Имя: " + creation['name'] +
        "<br>Родители: " + creation['parents'][0] + ", " + creation['parents'][1] + "<br>Зрение: " + creation['eye'] +
        "<br>Выносливость: " + creation['endurance'] + "<br>Ген: " + creation['gen'] +
        "<br>Всего существ: " + countCreations() + "</p><hr></div>" + document.getElementById("news").innerHTML;
    limitNews();
}

function limitNews() {
    let element = document.getElementById("news");
    while (element.childNodes.length > news_limit) {
        element.removeChild(element.lastChild);
    }
}

function description(element) {
    modal(element.getAttribute("title").split("\n").join( "<br>"), true);
}

function modal(message, quit= false) {
    document.getElementById("modal").style.display = 'block';
    document.getElementById("modal").innerHTML = message + "<br><br>" +
        (quit ? "<a class='button' onclick='document.getElementById(\"modal\").style.display = \"none\"'>Закрыть</a>" :
        "<a class='button' onclick='location.reload()'>Перезапустить</a>");
}

function popup(message) {

    let box = document.querySelector('#alert').cloneNode(true);
    box.removeAttribute("id");
    box.style.display = "block";
    box.childNodes[3].innerText = message;
    document.querySelector("body").prepend(box);

    setTimeout(function () {
        box.parentNode.removeChild(box);
    }, 2500);
}

function countCreations() {
    let count = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (area[i][j]['type'] === 'creation') {
                count++;
            }
        }
    }
    return count;
}

function moveCreation(from, to, step) {
    if (Math.abs(from[0] - to[0]) > step) {
        to[0] = from[0] + Math.sign(to[0] - from[0]) * step;
    }
    if (Math.abs(from[1] - to[1]) > step) {
        to[1] = from[1] + Math.sign(to[1] - from[1]) * step;
    }
    if (to[0] < 0) to[0] = 0;
    if (to[1] < 0) to[1] = 0;
    if (to[0] >= height) to[0] = height - 1;
    if (to[1] >= width) to[1] = width - 1;

    let position = area[to[0]][to[1]];
    move(from, to);
    return position;
}

function move(from, to) {
    doMovement(from, to);
    area[from[0]][from[1]] = {type: "empty"};
}

function doMovement(from, to) {
    area[to[0]][to[1]] = area[from[0]][from[1]];
    area[to[0]][to[1]]['points'] -= 1;
}

function getAround(i, k, eye) {
    let around = [], x, y, j;
    for (j = 0; j < (Math.pow(eye * 2 + 1, 2)); j++) {
        x = i - eye + (j % (eye * 2 + 1));
        y = k - eye + Math.floor(j / (eye * 2 + 1));
        if (!(x === i && y === k) && x >= 0 && x < width && y >= 0 && y < height) {
            around.push([x, y]);
        }
    }
    return around;
}

function fillGoods() {
    for (let i = 0; i < height; i++) {
        for (let k = 0; k < width; k++) {
            if (area[i][k]['type'] === "empty" && getRandomInt(goods_random) === 1) {
                area[i][k] = {type: "point"};
            }
        }
    }
}

function draw() {
    let html = "<table class='board'><tbody>";
    let colors = ["#ffffff", "#00ff11", "#ff5500", "#ffff00"];
    for (let i = 0; i < height; i++) {
        html += "<tr>";
        for (let k = 0; k < width; k++) {
            if (area[i][k]['type'] === "empty") {
                html += "<td>&nbsp;</td>";
            } else if (area[i][k]['type'] === "point") {
                html += "<td class='creature creature-leaf'></td>";
            } else {
                html += "<td class='creature creature" + area[i][k]['skin'] + "' title='" + area[i][k]['name'] + "\nРодители: " + area[i][k]['parents'][0] + ", " +
                    area[i][k]['parents'][1] + "\nВозраст: " + area[i][k]['age'] + "\nОчки: " + area[i][k]['points'] + "\nЗрение: " + area[i][k]['eye'] + "\nГолод: " +
                    area[i][k]['hungry'] + "" + "\nВыносливость: " + area[i][k]['endurance'] + "\nСила: " + area[i][k]['power'] +
                    "\nГен: " + area[i][k]['gen'] + "' onclick='description(this)'><span></span></td>";
            }
        }
        html += "</tr>";
    }
    html += "</tbody></table>";
    document.getElementById("area").innerHTML = html;
}

function getCreatures() {
    let creatures = [];
    for (let i = 0; i < height; i++) {
        for (let k = 0; k < width; k++) {
            if (area[i][k]['type'] === "creation") {
                creatures.push([i, k]);
            }
        }
    }
    return creatures;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}