'use strict';

class Config {
    constructor(table) {
        this.table = table;
        this.screens = {};
        this.makeHeader();
    }

    makeHeader() {
        const thead = document.createElement('thead');
        const cols = ['Name', 'Width', 'Height', 'Tile Width', 'Tile Height', 'X Offset', 'Y Offset', 'BG Hue'];
        for(const col of cols) {
            const th = document.createElement('th');
            th.innerText = col;
            thead.appendChild(th);
        }

        const th = document.createElement('th');
        const add = document.createElement('button');
        th.appendChild(add);
        thead.appendChild(th);

        add.innerText = 'Add';
        add.addEventListener('click', () => this.addScreen());

        this.table.appendChild(thead);
    }

    addScreen() {
        const uid = '_' + Math.random().toString(36).substr(2, 9);
        this.screens[uid] = {
            name: 'Screen',
            width: 512,
            height: 512,
            tileWidth: 64,
            tileHeight: 64,
            offsetX: 0,
            offsetY: 0,
            bgHue: .5
        };
        this.update();

        const tr = document.createElement('tr');
        tr.classList.add(uid);

        const i = (type, value, eventCb, eventType = 'change') => {
            const field = document.createElement('input');
            field.type = type;
            field.value = value;
            field.addEventListener(eventType, e => {
                eventCb(e);
                this.update();
            });

            const td = document.createElement('td');
            td.appendChild(field);
            tr.appendChild(td);
            return field;
        }

        i('text', 'Screen', e => this.screens[uid].name = e.target.value);
        const w = i('number', 512, e => this.screens[uid].width = e.target.value);
        const h = i('number', 512, e => this.screens[uid].height = e.target.value);
        const tW = i('number', 64, e => this.screens[uid].tileWidth = e.target.value);
        const tH = i('number', 64, e => this.screens[uid].tileHeight = e.target.value);
        i('number', 0, e => this.screens[uid].offsetX = e.target.value);
        i('number', 0, e => this.screens[uid].offsetY = e.target.value);
        i('number', 180, e => this.screens[uid].bgHue = e.target.value / 360);

        i('button', 'Delete', e => {
            delete this.screens[uid];
            this.table.removeChild(tr);
        }, 'click');

        w.min = h.min = tW.min = tH.min = 1;

        this.table.appendChild(tr);
    }

    subscribe(cb) {
        this.updateCb = cb;
        this.update();
    }

    update() {
        if(this.updateCb)
            this.updateCb(this.screens);
    }
}
