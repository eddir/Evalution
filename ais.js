let width, height, goods_random, news_limit, spawn_limit, period, alphabit;

width = height = 20;
goods_random = 100;
spawn_random = 100;
news_limit = 50;
spawn_limit = 20;
period = 2000;
alphabit = 36;

let area = [[]], name = 0x1;

for (let i = 0; i < height; i++) {
    area[i] = [];
    for (let k = 0; k < width; k++) {
        area[i][k] = {type: "empty"};
    }
}

tick();
setInterval(tick, period);

function tick() {
    steps();
    spawn();
    fillGoods();
    draw();
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
            name: name++,
            type: "creation",
            status: 3,
            parents: [0, 0],
            points: 10,
            age: 0,
            eye: 1,
            gen: getRandomInt(10),
            step: 1,
            hungry: 0,
            endurance: 0,
            power: 0,
            skin: getRandomInt(15)
        };
        broadCastResurrection(area[y][x]);
    }
}

function steps() {
    let creatures = getCreatures();
    for (let i = 0; i < creatures.length; i++) {
        doStep(creatures[i][0], creatures[i][1])
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
                        eye: Math.floor((area[vx][vy]['eye'] + area[x][y]['points'])/2),
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
        if (area[environment[i][0]][environment[i][1]]['type'] === "creation") {
            let vx = environment[i][0];
            let vy = environment[i][1];

            if ((area[x][y]['power'] + area[x][y]['points']) > (area[vx][vy]['power'] + area[vx][vy]['points'])) {
                broadCastDeath(area[x][y]['name'], area[vx][vy]['name']);
                area[x][y]['points'] += area[vx][vy]['points'];
                area[x][y]['power'] = Math.floor(getRandomInt(110) / 100 * area[x][y]['power']);
                moveCreation([x, y], [vx, vy], radius);
                area[x][y]['status'] = 2;
            } else {
                broadCastDeath(area[vx][vy]['name'], area[x][y]['name']);
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

function broadCastResurrection(creation) {
    document.getElementById("news").innerHTML = "<div><h2>Божественно</h2><p>Имя: " + creation['name'].toString(alphabit) +
        "<br>Родители: " + creation['parents'][0].toString(alphabit) + ", " + creation['parents'][1].toString(alphabit) + "<br>Зрение: " + creation['eye'] +
        "<br>Выносливость: " + creation['endurance'] + "<br>Ген: " + creation['gen'] +
        "<br>Всего существ: " + countCreations() + "</p><hr></div>" + document.getElementById("news").innerHTML;
    limitNews();
}


function broadCastDeath(killer, victim) {
    document.getElementById("news").innerHTML = "<div><h2>Смерть</h2><p>Убит: " + victim.toString(alphabit) +
        "<br>Убийца: " + killer.toString(alphabit) +  "<br>Всего существ: " + countCreations() + "</p><hr></div>" + document.getElementById("news").innerHTML;
    limitNews();
}

function broadCastBirth(creation) {
    document.getElementById("news").innerHTML = "<div><h2>Рождение</h2><p>Имя: " + creation['name'].toString(alphabit) +
        "<br>Родители: " + creation['parents'][0].toString(alphabit) + ", " + creation['parents'][1].toString(alphabit) + "<br>Зрение: " + creation['eye'] +
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
                html += "<td class='creature creature" + area[i][k]['skin'] + "' title='" + area[i][k]['name'].toString(alphabit) + "\nРодители: " + area[i][k]['parents'][0].toString(alphabit) + ", " +
                    area[i][k]['parents'][1].toString(alphabit) + "\nВозраст: " + area[i][k]['age'] + "\nЗрение: " + area[i][k]['eye'] + "\nГолод: " +
                    area[i][k]['hungry'] + "" + "\nВыносливость: " + area[i][k]['endurance'] + "\nСила: " + area[i][k]['power'] +
                    "\nГен: " + area[i][k]['gen'] + "'><span></span></td>";
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