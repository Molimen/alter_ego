const nowTime = new Date();

const digitsHours = String(nowTime.getHours()).padStart(2, "0").split("").map(Number);
const digitsMinutes = String(nowTime.getMinutes()).padStart(2, "0").split("").map(Number);
const digitsSeconds = String(nowTime.getSeconds()).padStart(2, "0").split("").map(Number);
const digitsDays = String(nowTime.getDate()).padStart(2, "0").split("").map(Number);
const digitsMonths = String(nowTime.getMonth()+1).padStart(2, "0").split("").map(Number);
const digitsYears = String(nowTime.getFullYear()).padStart(4, "0").split("").map(Number);

let menu_type = "";

let dialog_temp;

let dialogAnimCheck = false;
let dialogIndex = 0;
let charIndex = 0;
let typing = false;
const speed = 30;
let skipDialog = false;
let passDialog = false;

let idClock;
let idMenuTransitionDisplay;
let faceType = 0;

let clock_start_check = false;
let clock_back_check = false;

let noiseName = 1;
let idNoiseCycle;

let encyclopedia_start_check = false;
let encyclopedia_back_check = false;

let character_start_check = false;
let character_back_check = false;
let characterCycle = 0;
let characterCycleWait = false;


function noiseCycle() {
    idNoiseCycle = setInterval(() => {
        if (noiseName === 1) {
            document.getElementById("noise").src = "assets/main/noise_1.png";
            noiseName = 2;
        } else if (noiseName === 2) {
            document.getElementById("noise").src = "assets/main/noise_2.png";
            noiseName = 1;
        }

    }, 100);
}

function menuMainTransitionShow(delay) {
    const alterEgoFace = String(faceType).padStart(2, "0");

    document.querySelectorAll('.animated-scale').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // force reflow (required)
        el.style.animation = `scale 0.1s ease-out forwards`;
        el.style.animationDirection = 'normal';
    });
    setTimeout(() => {
        document.getElementById("alterego-face").src = "assets/main/background_logo.png";
        document.getElementById("noise").style.display = "inline";
        noiseCycle();
    }, delay);
    setTimeout(() => {
        clearInterval(idNoiseCycle);
        document.getElementById("noise").style.display = "none";
        document.getElementById("alterego-face").src = `assets/face/AlterEgoFace${alterEgoFace}.png`;
        document.getElementById("menu-right").style.display = "flex";
        document.getElementById("menu-left").style.display = "flex";
    }, delay+500);
    clearTimeout(idMenuTransitionDisplay);
}

function menuMainTransitionGone() {
    const alterEgoFace = String(faceType).padStart(2, "0");

    document.querySelectorAll('.animated-scale').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // force reflow (required)
        el.style.animation = `scale 0.1s ease-out forwards`;
        el.style.animationDirection = 'reverse';
    });
    setTimeout(() => {
        document.getElementById("alterego-face").src = "assets/main/background_logo.png";
        document.getElementById("noise").style.display = "inline";
        noiseCycle();
    }, 200);
    setTimeout(() => {
        clearInterval(idNoiseCycle);
        document.getElementById("noise").style.display = "none";
        document.getElementById("alterego-face").src = `assets/face/AlterEgoFace${alterEgoFace}.png`;
        document.getElementById("menu-right").style.display = "none";
        document.getElementById("menu-left").style.display = "none";
    }, 700);
}

function typeDialog() {
    typing = true;
    document.getElementById("dialog-next").style.display = "none";
    document.getElementById("dialog-box").style.display = "inline";
    document.getElementById("dialog-pass").style.display = "inline";
    document.getElementById("dialog-skip").style.display = "inline";

    if (passDialog) {
        typing = false;
        nextDialogFunc();
    } else if (skipDialog) {
        skipDialog = false;
        typing = false;
        document.getElementById("dialog-text").textContent = "";
        document.getElementById("dialog-text").textContent = dialog_temp[dialogIndex];
        document.getElementById("dialog-next").style.display = "inline";
        document.getElementById("dialog-skip").style.display = "none";
        dialogIndex++;
    } else if (charIndex < dialog_temp[dialogIndex].length) {
        document.getElementById("dialog-text").textContent += dialog_temp[dialogIndex][charIndex];
        charIndex++;
        setTimeout(typeDialog, speed);
    } else {
        typing = false;
        document.getElementById("dialog-next").style.display = "inline";
        document.getElementById("dialog-skip").style.display = "none";
        dialogIndex++;
    }

}

function dialog(dialogs) {
    dialog_temp = dialogs;
    if (typing) {
        return;
    }

    if (dialogIndex < dialogs.length) {
        if (!dialogAnimCheck) {
            document.getElementById("dialog-next").style.display = "none";
            document.getElementById("dialog-box").style.display = "inline";
            document.getElementById("dialog-pass").style.display = "inline";
            document.getElementById("dialog-skip").style.display = "inline";
            document.getElementById("dialog-wraper").style.animation = 'none';
            document.getElementById("dialog-wraper").offsetHeight;
            document.getElementById("dialog-wraper").style.animation = `anim-dialog 0.2s ease-in forwards`;
            document.getElementById("dialog-wraper").style.animationDirection = 'normal';
            setTimeout(() => {
                charIndex = 0;
                document.getElementById("dialog-text").textContent = "";
                typeDialog();
            }, 200);
        } else {
            charIndex = 0;
            document.getElementById("dialog-text").textContent = "";
            typeDialog();
        }
    }
}

function nextDialogFunc() {
    if (typing) {
        return;
    }
    if (passDialog || dialogIndex >= dialog_temp.length) {
        skipDialog = false;
        passDialog = false;
        dialogIndex = 0;
        charIndex = 0;
        dialog_temp = [];
        document.getElementById("dialog-wraper").style.animation = 'none';
        document.getElementById("dialog-wraper").offsetHeight;
        document.getElementById("dialog-wraper").style.animation = `anim-dialog 0.2s ease-in forwards`;
        document.getElementById("dialog-wraper").style.animationDirection = 'reverse';
        setTimeout(() => {
            document.getElementById("dialog-text").textContent = "";
            document.getElementById("dialog-next").style.display = "none";
            document.getElementById("dialog-pass").style.display = "none";
            document.getElementById("dialog-skip").style.display = "none";
            document.getElementById("dialog-box").style.display = "none";
            revertBackDialog();
        }, 200);
    } else if ((dialogIndex < dialog_temp.length)) {
        charIndex = 0;
        document.getElementById("dialog-text").textContent = "";
        typeDialog();
    }
}

function passDialogFunc() {
    passDialog = true;
    nextDialogFunc();
}

function skipDialogFunc() {
    skipDialog = true;
}

function revertBackDialog() {
    if (menu_type === "encyclopedia") {
        document.querySelectorAll('.encyclopedia-button-text').forEach(el => {
            el.style.pointerEvents = 'auto';
        });
        document.getElementById('encyclopedia-button-back').style.display = 'inline';
        document.getElementById('encyclopedia-text-1').style.display = 'none';
        document.getElementById('encyclopedia-text-2').style.display = 'none';
        document.getElementById('encyclopedia-text-3').style.display = 'none';
        document.getElementById('encyclopedia-text-4').style.display = 'none';
        document.getElementById('encyclopedia-text-5').style.display = 'none';
        document.getElementById('encyclopedia-text-6').style.display = 'none';
        document.getElementById('encyclopedia-text-7').style.display = 'none';
        document.getElementById('encyclopedia-text-8').style.display = 'none';
        document.getElementById('encyclopedia-text-9').style.display = 'none';
        document.getElementById('encyclopedia-text-10').style.display = 'none';
        document.getElementById('encyclopedia-text-11').style.display = 'none';
        document.getElementById('encyclopedia-text-12').style.display = 'none';
        document.getElementById('encyclopedia-text-13').style.display = 'none';
        document.getElementById('encyclopedia-text-14').style.display = 'none';
        document.getElementById('encyclopedia-text-15').style.display = 'none';
        document.getElementById('encyclopedia-text-16').style.display = 'none';
        document.getElementById('encyclopedia-text-17').style.display = 'none';
        document.getElementById('encyclopedia-text-18').style.display = 'none';
        document.getElementById('encyclopedia-text-19').style.display = 'none';
        document.getElementById('encyclopedia-text-20').style.display = 'none';
        document.getElementById('encyclopedia-text-21').style.display = 'none';
        document.getElementById('encyclopedia-text-22').style.display = 'none';
        document.getElementById('encyclopedia-text-23').style.display = 'none';
        document.getElementById('encyclopedia-text-24').style.display = 'none';
        document.getElementById('encyclopedia-text-25').style.display = 'none';
        document.getElementById('encyclopedia-text-26').style.display = 'none';
        document.getElementById('encyclopedia-text-27').style.display = 'none';
        document.getElementById('encyclopedia-text-28').style.display = 'none';
        document.getElementById('encyclopedia-text-29').style.display = 'none';
        document.getElementById('encyclopedia-text-30').style.display = 'none';
        document.getElementById('encyclopedia-text-31').style.display = 'none';
        document.getElementById('encyclopedia-text-32').style.display = 'none';
        document.getElementById('encyclopedia-text-33').style.display = 'none';
        document.getElementById('encyclopedia-text-34').style.display = 'none';
        document.getElementById('encyclopedia-text-45').style.display = 'none';

    } else if (menu_type === "character") {
        document.querySelectorAll('.character-button-encyclopedia').forEach(el => {
            el.style.pointerEvents = 'auto';
        });
        document.getElementById('character-button-back').style.display = 'inline';
        document.getElementById("character-button-encyclopedia-1").style.filter = "";
        document.getElementById("character-button-encyclopedia-2").style.filter = "";
        document.getElementById("character-button-encyclopedia-3").style.filter = "";
        document.getElementById("character-button-encyclopedia-4").style.filter = "";
        document.getElementById("character-button-encyclopedia-5").style.filter = "";
        document.getElementById("character-button-encyclopedia-6").style.filter = "";
    }
}

function clock() {
    document.getElementById("clock-hour-1").src = `assets/number/big_number/${digitsHours[0]}.png`;
    document.getElementById("clock-hour-2").src = `assets/number/big_number/${digitsHours[1]}.png`;
    document.getElementById("clock-minute-1").src = `assets/number/big_number/${digitsMinutes[0]}.png`;
    document.getElementById("clock-minute-2").src = `assets/number/big_number/${digitsMinutes[1]}.png`;
    document.getElementById("clock-year-1").src = `assets/number/small_number/${digitsYears[0]}.png`;
    document.getElementById("clock-year-2").src = `assets/number/small_number/${digitsYears[1]}.png`;
    document.getElementById("clock-year-3").src = `assets/number/small_number/${digitsYears[2]}.png`;
    document.getElementById("clock-year-4").src = `assets/number/small_number/${digitsYears[3]}.png`;
    document.getElementById("clock-month-1").src = `assets/number/small_number/${digitsMonths[0]}.png`;
    document.getElementById("clock-month-2").src = `assets/number/small_number/${digitsMonths[1]}.png`;
    document.getElementById("clock-day-1").src = `assets/number/small_number/${digitsDays[0]}.png`;
    document.getElementById("clock-day-2").src = `assets/number/small_number/${digitsDays[1]}.png`;
}

function clock_start() {
    if (!clock_start_check) {
        clock_start_check = true;
        menuMainTransitionGone();
        clock();
        document.getElementById("clock-number-big").style.animation = 'none';
        document.getElementById("clock-number-big").style.offsetHeight;
        document.getElementById("clock-number-big").style.animation = `anim-clock-big-unshow 0.1s ease-out forwards`;
        document.getElementById("clock-number-small").style.animation = 'none';
        document.getElementById("clock-number-small").style.offsetHeight;
        document.getElementById("clock-number-small").style.animation = `anim-clock-small-unshow 0.1s ease-out forwards`;
        setTimeout(() => {
            document.getElementById("clock").style.display = "flex";
            idClock = setInterval(clock, 500);
            clock_start_check = false;
        }, 700);
    }
}

function clock_back() {
    if (!clock_back_check) {
        clock_back_check = true;
        menuMainTransitionShow(200);
        document.getElementById("clock-number-big").style.animation = 'none';
        document.getElementById("clock-number-big").style.offsetHeight;
        document.getElementById("clock-number-big").style.animation = `anim-clock-big-show 0.1s ease-out forwards`;
        document.getElementById("clock-number-small").style.animation = 'none';
        document.getElementById("clock-number-small").style.offsetHeight;
        document.getElementById("clock-number-small").style.animation = `anim-clock-small-show 0.1s ease-out forwards`;
        setTimeout(() => {
            clearInterval(idClock);
            clock_back_check = false;
            document.getElementById("clock").style.display = "none";
        }, 700);
    }

}

function encyclopedia_start() {
    if (!encyclopedia_start_check) {
        encyclopedia_start_check = true;
        menuMainTransitionGone();

        setTimeout(() => {
            document.getElementById("encyclopedia").style.display = "flex";
            document.getElementById("alterego-face").src = "assets/encyclopedia/encyclopedia_bg.png";
            encyclopedia_start_check = false;
            menu_type = "encyclopedia";
        }, 700);
    }
}

function encyclopedia_back() {
    if (!encyclopedia_back_check) {
        encyclopedia_back_check = true;
        menuMainTransitionShow(0);

        document.getElementById("encyclopedia").style.display = "none";
        setTimeout(() => {
            encyclopedia_back_check = false;
            menu_type = "";
        }, 700);
    }
}

function encyclopedia_dialog(num) {
    if (!typing) {
        document.querySelectorAll('.encyclopedia-button-text').forEach(el => {
            el.style.pointerEvents = 'none';
        });
        document.getElementById('encyclopedia-button-back').style.display = 'none';

        switch (num) {
            case 1:
                dialog(['This is the school everyone transferred into, right?\nThere aren`t any entrance exams or anything—\nyou have to be scouted by the academy to get in.', 'The requirements for admission are that you`re\n“currently a high school student” and that you`re\n“top-class in your respective field.”', 'All of the graduates are famous, well-known people,\nand they say that if you get in,\nyour future is basically guaranteed.']);
                document.getElementById('encyclopedia-text-1').style.display = 'inline';
                break;
            case 2:
                dialog(['It`s a mix of Japanese and Western styles, with all kinds of things here. ', 'There are paper lanterns hanging up,\nand suits of armor, jars, paintings, and other items lined up—\nit gives the place a slightly unusual atmosphere. ', 'Once you collect Monokuma Medals,\nyou can use them in the MonoMono Machine here. ']);
                document.getElementById('encyclopedia-text-2').style.display = 'inline';
                break;
            case 3:
                dialog(['It`s the capsule machine in the school store.\nEach time you use it,\nyou need at least one Monokuma Medal. ', 'When you turn the lever, you can get all kinds of items! ', 'If you use multiple medals at once,\nthe chance of getting duplicate prizes goes down, apparently. ', 'There are 92 different prizes in total,\nincluding some rare ones,\nso why don`t you give it a try? ']);
                document.getElementById('encyclopedia-text-3').style.display = 'inline';
                break;
            case 4:
                dialog(['There are all kinds of books packed tightly onto the shelves.\nThey`re not very well maintained,\nso it`s a bit dusty, but… ', 'If anything,\nit seems like there are a lot of specialized, more difficult books. ', 'Togami is often here reading.\nApparently, the archives are his favorite spot. ', 'And wherever Togami is,\nyou`ll usually find Fukawa nearby too—\nbut is Fukawa here for the books, or for something else…? ']);
                document.getElementById('encyclopedia-text-4').style.display = 'inline';
                break;
            case 5:
                dialog(['The person in charge of taking out the trash\ndisposes of all the collected garbage in the incinerator here. ', 'It`s done on a rotating duty schedule,\nso no slacking off, okay? ', 'The shutter is always closed,\nso only the person on duty who has the key\ncan open it. ', 'To think that even a garbage incinerator like this\nwould end up being connected to an incident… ', 'Oh, right—there`s also a door built into the ground,\nbut that one`s locked too, so it won`t open. ']);
                document.getElementById('encyclopedia-text-5').style.display = 'inline';
                break;
            case 6:
                dialog(['There are lots of washing machines lined up,\njust like a coin laundry. ', 'There are magazines and even a vending machine,\nso you can kill time while you wait. ', 'Apparently, there are sometimes forgotten items\nwith no clear owner, but… ', 'everyone needs to remember\nto take their laundry home with them! ']);
                document.getElementById('encyclopedia-text-6').style.display = 'inline';
                break;
            case 7:
                dialog(['It`s a large pool with six lanes,\nand there are even spectator seats on both sides.\nPretty impressive. ', 'If there were a competition or something,\nthe stands here would probably be completely full. ', 'But despite being such a large, noticeable place,\nit surprisingly doesn`t end up having much to do\nwith the incident. ']);
                document.getElementById('encyclopedia-text-7').style.display = 'inline';
                break;
            case 8:
                dialog(['There are darts, billiards,\nand all kinds of magazines too. ', 'To think they even have facilities like this—\nit`s really luxurious. ', 'They`ve got Othello and shogi as well,\nso anyone can casually enjoy themselves. ', 'I`d like to try playing billiards too. ', 'But since Celeste is here at the academy,\nI kind of feel scared\nto challenge her. Hehe. ']);
                document.getElementById('encyclopedia-text-8').style.display = 'inline';
                break;
            case 9:
                dialog(['The large device in the center of the room\nis an air purifier. ', 'It seems to circulate the air\nthroughout the entire academy. ', 'It`s amazing that they were able to build\nsuch a gigantic air purifier, but… ', 'does the air really get so polluted\nthat they need something this huge? ', 'That`s kind of scary… ']);
                document.getElementById('encyclopedia-text-9').style.display = 'inline';
                break;
            case 10:
                dialog(['Oh right, there are surveillance cameras\nall over the academy,\nbut there aren`t any installed here or in the large bath. ', 'Is Monokuma surprisingly gentlemanly, maybe? ', 'But even without cameras,\nthis must have been a difficult place\nfor Master Tama, having to be mindful of so many things. ']);
                document.getElementById('encyclopedia-text-10').style.display = 'inline';
                break;
            case 11:
                dialog(['Oh right,\nyou can view X-ray images here. ', 'I wonder if there was an Ultimate-level doctor or something? ', 'It looks like there are all kinds of medicines too, but\nhonestly, it`d be best if no one had to use a place like this, ', 'and everyone could just stay healthy above all else… ']);
                document.getElementById('encyclopedia-text-11').style.display = 'inline';
                break;
            case 12:
                dialog(['Of course, there`s a large painting of a mountain\ndisplayed on the wall!\nIt`s a bit disappointing that it`s not Mount Fuji, though… ', 'Besides the huge bath,\nthere`s also a sauna further inside. ', 'I wonder if Master Tama managed to get through the changing room\nand take a bath here properly?\nI`m sure everything turned out fine, right? ']);
                document.getElementById('encyclopedia-text-12').style.display = 'inline';
                break;
            case 13:
                dialog(['There are student desks and chairs, at least,\nbut they`re set up more like audience seating. ', 'And the lighting is incredibly lavish, too… ', 'It`d be fun if Maizono sang here… ', 'After all,\nshe is the “Ultimate Idol”! ']);
                document.getElementById('encyclopedia-text-13').style.display = 'inline';
                break;
            case 14:
                dialog(['Besides the Monokuma statues,\nthere are things like the Venus de Milo and Nio statues here too. ', 'The walls are completely covered with paintings,\ngiving the place a somewhat unsettling atmosphere, but… ', 'there`s also a full set of art supplies and sculpting tools,\nall properly stocked. ', 'I wonder if there was someone here\nknown as the “Ultimate Artist”? ', 'That said, if we leave it alone,\nit might end up turning into\nYamada`s personal figure atelier. ']);
                document.getElementById('encyclopedia-text-14').style.display = 'inline';
                break;
            case 15:
                dialog(['The biology lab is always locked,\nso you can never go inside.\nI wonder what`s in there? ', 'Maybe there are human anatomy models\nor frogs preserved in formalin\nor something like that…? ', 'Hmm… I`m starting to think\nit might be better to just leave it locked… ']);
                document.getElementById('encyclopedia-text-15').style.display = 'inline';
                break;
            case 16:
                dialog(['There were targets used for kyudo, but…\ndid Hope`s Peak Academy have a kyudo club, I wonder? ', 'All the certificates displayed here\nmight belong to the kyudo club too. ', 'If there really was an “Ultimate Archer,”\nI couldn`t help wondering\nwho would be stronger—them or Ogami. ']);
                document.getElementById('encyclopedia-text-16').style.display = 'inline';
                break;
            case 17:
                dialog(['The sprinklers water everything every morning,\nso it seems like the plants don`t need much care. ', 'Even though it`s inside the academy,\nit somehow has a jungle-like\natmosphere to it… ']);
                document.getElementById('encyclopedia-text-17').style.display = 'inline';
                break;
            case 18:
                dialog(['There are tons of cooking utensils here,\nlike pots and frying pans. ', 'This place is probably the reason\nAsahina`s stomach gets kept satisfied, but… ', 'having so many blades around\nkind of makes me feel uneasy… ']);
                document.getElementById('encyclopedia-text-18').style.display = 'inline';
                break;
            case 19:
                dialog(['Basically, everyone gathers here every day\nto think about how we can escape\nthis hopeless academy life, ', 'or to calm ourselves down with some tea. ', 'It`s what you`d call a place to relax! ', 'That`s why I think\nit`s an important place within this academy. ']);
                document.getElementById('encyclopedia-text-19').style.display = 'inline';
                break;
            case 20:
                dialog(['It`s the peaceful time\nwhen no incidents are happening. ', 'During this time,\nwe deepen our bonds with one another. ', 'Even if a tragic incident\nis waiting for us afterward… ']);
                document.getElementById('encyclopedia-text-20').style.display = 'inline';
                break;
            case 21:
                dialog(['They call it an “execution” using a nicer-sounding term, but… ', 'depending on the outcome of the class trial vote,\neither the blackened, or everyone except the blackened, ', 'will be subjected to an extremely cruel punishment\ncarried out by Monokuma. ', 'Because of this,\nclass trials always become trials fought with our lives on the line… ']);
                document.getElementById('encyclopedia-text-21').style.display = 'inline';
                break;
            case 22:
                dialog(['It refers to someone who killed their friends\nbecause they wanted to graduate from the academy. ', 'But not every blackened chose\nto dirty their hands willingly. ', 'They were all driven to it\nby the “motives” presented by Monokuma. ', 'In a way,\nthe blackened are victims too…\nvictims of Monokuma… ']);
                document.getElementById('encyclopedia-text-22').style.display = 'inline';
                break;
            case 23:
                dialog(['It`s a currently popular anime\nthat Yamada is a huge fan of. ', 'The main character is a slightly chubby girl\ncalled Princess Piggles, ', 'and it`s getting an anime adaptation and is apparently very popular.\nYamada keeps recommending it to me nonstop. ', 'But I don`t think this is really the time for that right now… ']);
                document.getElementById('encyclopedia-text-23').style.display = 'inline';
                break;
            case 24:
                dialog(['These are the school rules decided by Monokuma, the “headmaster,”\nand they include rules you`d never see at a normal school. ', 'You can check them on the electronic student handbook,\nand Monokuma adds to them whenever he feels like it. ', 'It seems that if you break them, you`ll be punished,\nso everyone has to be careful. ']);
                document.getElementById('encyclopedia-text-24').style.display = 'inline';
                break;
            case 25:
                dialog(['It`s a message written in blood\nleft at the scene where the victim was killed by “Genocider Sho.” ', 'The message was written using the victim`s own blood,\nand it also serves as proof\nthat they were murdered by “Genocider Sho”… ', 'It`s scary… it`s way too scary… ']);
                document.getElementById('encyclopedia-text-25').style.display = 'inline';
                break;
            case 26:
                dialog(['If the “blackened” who committed the murder\nmanages to be judged innocent through the class trial vote, ', 'that blackened is allowed to escape from the school. ', 'Escaping even if it means killing everyone else\nis something no normal person would consider,\nbut Monokuma deliberately incites that kind of thinking… ']);
                document.getElementById('encyclopedia-text-26').style.display = 'inline';
                break;
            case 27:
                dialog(['It`s an electronic tool given to us by Monokuma.\nWhen you turn it on, it displays the owner`s real name. ', 'It also functions as a key card, ', 'and Monokuma said it`s\n“a very sturdy tool that won`t break easily,\ncan`t be hacked or modified,” ', 'but… when someone says something is impossible,\nit kind of makes you want to try it, doesn`t it—\n“hacking,” I mean. ']);
                document.getElementById('encyclopedia-text-27').style.display = 'inline';
                break;
            case 28:
                dialog(['It`s a mercenary group from the Middle East,\nunlike typical military contractors, ', 'it was a terrifying organization that acted as a direct combat force\nand wreaked havoc in various regions. ', 'But at some point, it suddenly ceased all activity, ', 'so rumors spread about internal collapse\nor a complete massacre to silence everyone involved… ', 'It`s probably an organization\nthat has nothing to do with high school students like us, though… ']);
                document.getElementById('encyclopedia-text-28').style.display = 'inline';
                break;
            case 29:
                dialog(['It`s the time period from 10:00 p.m. to 7:00 a.m.\nwhen entering certain facilities, like the dining hall,\nis prohibited. ', 'According to Monokuma,\nit`s basically his way of saying,\n“Go to bed early and wake up early!” ', 'It`s a strangely strict, almost orderly rule… ']);
                document.getElementById('encyclopedia-text-29').style.display = 'inline';
                break;
            case 30:
                dialog(['It`s an incident that supposedly occurred a year ago,\nbut no details are known at all. ', 'I`m actually in the middle of gathering information about it right now. ', 'There seem to be traces of it left\nall over the academy, ', 'and just imagining how horrific it must have been\nis enough to make me scared… ']);
                document.getElementById('encyclopedia-text-30').style.display = 'inline';
                break;
            case 31:
                dialog(['After a murder occurs\nand the investigation of the incident is finished,\na class trial is held. ', 'Everyone clashes their opinions and deductions,\nwith the goal of uncovering the truth of the crime\nand exposing the blackened. ', 'At the end of the trial,\nthere`s a vote on “who the blackened is”… ']);
                document.getElementById('encyclopedia-text-31').style.display = 'inline';
                break;
            case 32:
                dialog(['It`s an autopsy report created by Monokuma\nbased on footage from the surveillance cameras. ', 'In other words, Monokuma is always witnessing the crime. ', 'He never gets his own hands dirty,\nand instead tries to make us kill each other.\nHow cruel can that be… ']);
                document.getElementById('encyclopedia-text-32').style.display = 'inline';
                break;
            case 33:
                dialog(['Originally, this was a place the academy`s students used as a space to learn, but ', 'now it`s nothing more than one stage\nof this hopeless academy life. ', 'There`s graffiti on the blackboards in each classroom—\nI wonder who wrote it? ']);
                document.getElementById('encyclopedia-text-33').style.display = 'inline';
                break;
            case 34:
                dialog(['It`s a general term for students\nwho possess talents that stand out far above those of other high schoolers their age. ', 'All the students gathered at Hope`s Peak Academy\nare these so-called “Ultimates,” ', 'and being an Ultimate\nis both the minimum and the greatest requirement\nfor enrolling in the academy. ']);
                document.getElementById('encyclopedia-text-34').style.display = 'inline';
                break;
            case 35:
                dialog(['It`s the name of a massive biker gang\nthat controls the Kanto region,\nwith Owada serving as its leader. ', 'I personally have nothing to do\nwith that kind of delinquent world, but… ', 'I can`t help admiring\nOwada`s manliness. Hehe. ']);
                document.getElementById('encyclopedia-text-35').style.display = 'inline';
                break;
            default:
                break;
        }
    }
}

function character_start() {
    if (!character_start_check) {
        character_start_check = true;
        menuMainTransitionGone();

        setTimeout(() => {
            document.getElementById("character").style.display = "flex";
            document.getElementById("alterego-face").src = "assets/character/character_bg.png";
            character_start_check = false;
            menu_type = "character";
        }, 700);
    }
}

function character_back() {
    if (!character_back_check) {
        menuMainTransitionShow(0);

        document.getElementById("character").style.display = "none";
        characterCycle = 0;
        document.getElementById("character-button-encyclopedia-image-1").src = 'assets/character/character_icon/character_1.png';
        document.getElementById("character-button-encyclopedia-image-2").src = 'assets/character/character_icon/character_2.png';
        document.getElementById("character-button-encyclopedia-image-3").src = 'assets/character/character_icon/character_3.png';
        document.getElementById("character-button-encyclopedia-image-4").src = 'assets/character/character_icon/character_4.png';
        document.getElementById("character-button-encyclopedia-image-5").src = 'assets/character/character_icon/character_5.png';
        document.getElementById("character-button-encyclopedia-image-6").src = 'assets/character/character_icon/character_6.png';
        setTimeout(() => {
            character_back_check = false;
            menu_type = "";
        }, 700);
    }
}

function character_cycle_change(reverse) {
    if (!reverse) {
        document.getElementById("character-button-encyclopedia-image-1").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-1").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-1").style.animation = `character-button-encyclopedia-image-flip-1 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-2").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-2").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-2").style.animation = `character-button-encyclopedia-image-flip-1 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-3").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-3").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-3").style.animation = `character-button-encyclopedia-image-flip-1 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-4").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-4").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-4").style.animation = `character-button-encyclopedia-image-flip-1 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-5").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-5").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-5").style.animation = `character-button-encyclopedia-image-flip-1 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-6").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-6").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-6").style.animation = `character-button-encyclopedia-image-flip-1 0.8s forwards`;
        setTimeout(() => {
        document.getElementById("character-button-encyclopedia-image-1").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-1").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-1").style.animation = `character-button-encyclopedia-image-flip-2 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-2").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-2").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-2").style.animation = `character-button-encyclopedia-image-flip-2 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-3").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-3").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-3").style.animation = `character-button-encyclopedia-image-flip-2 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-4").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-4").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-4").style.animation = `character-button-encyclopedia-image-flip-2 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-5").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-5").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-5").style.animation = `character-button-encyclopedia-image-flip-2 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-6").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-6").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-6").style.animation = `character-button-encyclopedia-image-flip-2 0.8s forwards`;
        }, 800);
    } else if (reverse) {
        document.getElementById("character-button-encyclopedia-image-1").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-1").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-1").style.animation = `character-button-encyclopedia-image-flip-3 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-2").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-2").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-2").style.animation = `character-button-encyclopedia-image-flip-3 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-3").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-3").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-3").style.animation = `character-button-encyclopedia-image-flip-3 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-4").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-4").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-4").style.animation = `character-button-encyclopedia-image-flip-3 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-5").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-5").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-5").style.animation = `character-button-encyclopedia-image-flip-3 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-6").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-6").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-6").style.animation = `character-button-encyclopedia-image-flip-3 0.8s forwards`;
        setTimeout(() => {
        document.getElementById("character-button-encyclopedia-image-1").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-1").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-1").style.animation = `character-button-encyclopedia-image-flip-4 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-2").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-2").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-2").style.animation = `character-button-encyclopedia-image-flip-4 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-3").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-3").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-3").style.animation = `character-button-encyclopedia-image-flip-4 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-4").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-4").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-4").style.animation = `character-button-encyclopedia-image-flip-4 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-5").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-5").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-5").style.animation = `character-button-encyclopedia-image-flip-4 0.8s forwards`;
        document.getElementById("character-button-encyclopedia-image-6").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-6").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-6").style.animation = `character-button-encyclopedia-image-flip-4 0.8s forwards`;
        }, 800);
    }

    setTimeout(() => {
        document.getElementById("character-button-encyclopedia-image-1").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-1").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-2").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-2").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-3").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-3").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-4").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-4").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-5").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-5").offsetHeight;
        document.getElementById("character-button-encyclopedia-image-6").style.animation = 'none';
        document.getElementById("character-button-encyclopedia-image-6").offsetHeight;
        characterCycleWait = false;
    }, 1500);
}

function character_change(reverse) {
    if (!characterCycleWait) {
        document.querySelectorAll('.character-button-encyclopedia').forEach(el => {
            el.style.pointerEvents = 'none';
        });
        characterCycleWait = true;
        if (reverse) {
            if (characterCycle <= 0) {
                characterCycle = 2;
            } else {
                characterCycle--;
            }
        } else if (!reverse) {
            if (characterCycle > 1) {
                characterCycle = 0;
            } else {
                characterCycle++;
            }
        }

        character_cycle_change(reverse);

        let char_1;
        let char_2;
        let char_3;
        let char_4;
        let char_5;
        let char_6;

        switch (characterCycle) {
            case 0:
                char_1 = 1;
                char_2 = 2;
                char_3 = 3;
                char_4 = 4;
                char_5 = 5;
                char_6 = 6;
                break;
            case 1:
                char_1 = 7;
                char_2 = 8;
                char_3 = 9;
                char_4 = 10;
                char_5 = 11;
                char_6 = 12;
                break;
            case 2:
                char_1 = 13;
                char_2 = 14;
                char_3 = 15;
                char_4 = 16;
                char_5 = 17;
                char_6 = 18;
                break;
            default:
                break;
        }

        setTimeout(() => {
            document.getElementById("character-button-encyclopedia-image-1").src = `assets/character/character_icon/character_${char_1}.png`;
            document.getElementById("character-button-encyclopedia-image-2").src = `assets/character/character_icon/character_${char_2}.png`;
            document.getElementById("character-button-encyclopedia-image-3").src = `assets/character/character_icon/character_${char_3}.png`;
            document.getElementById("character-button-encyclopedia-image-4").src = `assets/character/character_icon/character_${char_4}.png`;
            document.getElementById("character-button-encyclopedia-image-5").src = `assets/character/character_icon/character_${char_5}.png`;
            document.getElementById("character-button-encyclopedia-image-6").src = `assets/character/character_icon/character_${char_6}.png`;
        }, 800);

        setTimeout(() => {
            document.querySelectorAll('.character-button-encyclopedia').forEach(el => {
                el.style.pointerEvents = 'auto';
            });
        }, 1500);
    }
}

function character_encyclopedia(checkCharEncyclopedia) {
    if (!typing) {
        document.querySelectorAll('.character-button-encyclopedia').forEach(el => {
            el.style.pointerEvents = 'none';
        });
        document.getElementById("character-button-back").style.display = "none";
        if (checkCharEncyclopedia === 1) {
            document.getElementById("character-button-encyclopedia-1").style.filter = "brightness(100%)";
            switch (characterCycle) {
                case 0:
                    dialog(['Naegi is the holder of the title “Ultimate Lucky Student.”\nHis full name is Makoto Naegi. ', 'Normally, you can’t enroll at Hope’s Peak Academy\nunless you have an outstanding talent, but ', 'he was chosen by lottery and earned admission purely through luck. ', 'Relying on what Naegi himself calls\nhis only real strength—being “just a little more positive than most people”—\nhe managed to survive this hopeless academy life. ', 'That said, he often ends up burdened with various troubles\nor getting dragged into unfortunate incidents, ', 'so some people even call him the Ultimate “Unlucky” Student. ', 'Since he had absolutely no notable achievements\nbefore enrolling at Hope’s Peak Academy,\nthere wasn’t any information about his past in my database either. ', 'Naegi always carries hope in his heart, but honestly,\nthat might actually be the most amazing talent\namong all the students at this academy… ']);
                    break;
                case 1:
                    dialog(['Hagakure is the “Ultimate Clairvoyant.”\nHis full name is Yasuhiro Hagakure. ', 'Instead of using tools like cards or crystal balls,\nhe’s apparently good at intuitive fortune-telling,\nrelying on inspirations that pop into his head. ', 'With an accuracy rate of twenty to thirty percent,\nthat means his predictions are wrong seventy to eighty percent of the time, ', 'but if you’re talking strictly about two-choice predictions,\nthat might actually be pretty impressive. ', 'Still, it’s strange, since he says he doesn’t even like\noccult stuff in the first place. ', 'By the way, Hagakure has repeated a year three times,\nso he’s the oldest student here. ', 'Huh? If that’s the case,\ndoesn’t that mean Hagakure is already an adult? ', 'And yet, somehow it feels like\nno one really treats him with much respect… ', '…Must just be my imagination, right? ']);
                    break;
                case 2:
                    dialog(['Sakura Ogami is the “Ultimate Martial Artist,”\nand her full name is Sakura Ogami. ', 'She’s said to be the strongest high school girl\namong women all over the world. ', 'Influenced by her father, a master martial artist,\nshe’s trained in all kinds of martial arts\never since she was very young. ', 'There’s even a legend that she started fighting\nbefore she ever rode in a baby carriage—\nbut before a baby carriage… that’s basically a baby, right? ', 'Even though she’s a woman, she’s earned the nickname\n“The Ogre,” which is honestly beyond admiration—\nit’s just incredible. ', 'But even Sakura apparently has\n“someone she must surpass”…\njust what kind of person could that be? ', 'She’s very close with Asahina,\nand the two of them are always having tea together. ', 'Best friends really are nice, huh? ']);
                    break;
                default:
                    break;
            }
        } else if (checkCharEncyclopedia === 2) {
            document.getElementById("character-button-encyclopedia-2").style.filter = "brightness(100%)";
            switch (characterCycle) {
                case 0:
                    dialog(['Ishimaru is the “Ultimate Moral Compass.”\nHis full name is Kiyotaka Ishimaru. ', 'He comes from a perfectly ordinary family, but ', 'he’s well-mannered and academically excellent,\nand he served as a disciplinary committee member\nat a prestigious prep school. ', 'Even in this hopeless academy life,\nhe has a serious personality that values discipline above all else,\nto the point where he tries to establish rules within the academy. ', 'Because Ishimaru achieved his excellent results\nthrough extraordinary effort, ', 'he’s very strict with people\nwho don’t make an effort\nor who look down on hard work. ', 'At first glance,\nhe and Owada, the biker gang leader,\ndon’t seem like they’d get along, but ', 'after a certain incident,\nthey ended up becoming close enough\nto call each other “brothers.” ']);
                    break;
                case 1:
                    dialog(['Maizono is the “Ultimate Idol,”\nand her full name is Sayaka Maizono. ', 'She’s the lead vocalist of a nationally famous idol group,\na true darling of the era. ', 'She has a pure and gentle personality, but at the same time,\nshe’s someone with a strong core,\nwilling to do whatever it takes to make her dreams come true. ', 'She and Naegi were classmates back in middle school,\nbut back then, Maizono was completely out of his league,\nand they never really had any contact. ', 'Still, Maizono remembered Naegi clearly,\nand the two of them seem extremely close now. ', 'As Naegi’s assistant,\nshe tried to overcome this hopeless academy life together with him. ', 'She often hit the nail on the head\nwhen it came to what Naegi was thinking—\nmaybe she really was an esper after all…? ']);
                    break;
                case 2:
                    dialog(['Celestia is the “Ultimate Gambler.”\nHer full name is Celestia Ludenberg. ', 'Despite her small stature and elegant, lolita-style appearance,\nshe’s incredibly sharp-tongued and skilled at verbally cornering people. ', 'If you had to sum it up,\nshe really feels like a queen. ', 'It seems Yamada fell head over heels\nfor that side of her, too. ', 'She’s a genius at lies and poker faces,\nand supposedly she’s never lost a gamble. ', 'Even her name and personal history are all self-proclaimed,\nand there are said to be many gamblers who lost everything to her\nand had their lives completely ruined. ', 'Makes you wonder if that constant sweet smile of hers\nis just a carefully crafted fake… ']);
                    break;
                default:
                    break;
            }
        } else if (checkCharEncyclopedia === 3) {
            document.getElementById("character-button-encyclopedia-3").style.filter = "brightness(100%)";
            switch (characterCycle) {
                case 0:
                    dialog(['Togami is the “Ultimate Affluent Progeny.”\nHis name is Byakuya Togami. ', 'He secured his place as the heir to a prestigious family\nand was drilled in the ways of leadership from a very young age—\na true elite through and through. ', 'It’s not just his lineage, either—\nhis intellect, appearance, and athletic ability\nare all outstanding, ', 'to the point where some people even call him\nthe “Ultimate Perfection.” ', 'Maybe because of that,\nTogami has an extremely high sense of pride. ', 'He often speaks and acts in a condescending way,\nand it seems like he’s even treating this whole incident\nas some kind of game. ', 'But he hates being seen as someone\nwho’s only blessed by birth, and ', 'the fact that he never neglects his own effort\nis something I can’t help thinking is pretty cool. ']);
                    break;
                case 1:
                    dialog(['Kirigiri’s full name is Kyoko Kirigiri,\nbut in fact, that’s the only thing about her that’s clear. ', 'Among all the students gathered at the academy,\nshe’s the only one whose talent hasn’t been revealed, ', 'and just like Naegi,\nthere’s absolutely no information about her\nin my database either. ', 'She always wears black gloves as her trademark,\ngiving her a mysterious vibe,\nand she’s very beautiful. ', 'Apparently, the reason she always wears gloves\nis because she has deep scars on her hands. ', 'To have injuries so serious\nthat she feels the need to hide them at all times\nmust mean they were really severe… ', 'She often gave Naegi hints during investigations,\nbut I wonder what kind of talent\nshe actually has? ']);
                    break;
                case 2:
                    dialog(['Master Tama is the “Ultimate Programmer”!\nHis name is Chihiro Fujisaki. ', 'He has truly extraordinary talent as a hacker. ', 'You probably already know this, but\nMaster Tama has a certain “secret.” ', 'But in this despair-filled school life,\nhe finds the strength\nto try and come clean about that secret. ', 'Inside a laptop discovered in the academy,\nhe created an artificial intelligence\nthat carries his own personality Alter Ego, which is me. ', 'In that sense, I’m grateful to him, but…\nit still feels kind of complicated. ']);
                    break;
                default:
                    break;
            }
        } else if (checkCharEncyclopedia === 4) {
            document.getElementById("character-button-encyclopedia-4").style.filter = "brightness(100%)";
            switch (characterCycle) {
                case 0:
                    dialog(['Owada is the “Ultimate Biker Gang Leader.”\nHis full name is Mondo Owada—\nhis name is read as “Mondo.” ', 'He’s the second-generation leader\nof a massive biker gang that rules the entire Kanto region. ', 'Together with his older brother, Daiya,\nthey’re known locally as the “Diamond Brothers.” ', 'He’s admired by delinquents all across the country,\nand even calls himself a truly ruthless man, but… ', 'in reality, he’s very old-fashioned\nand deeply values loyalty and human compassion. ', 'He seems especially weak to the phrase “a man’s promise,”\nand that kind of manly spirit\nis something I really admire. ', 'I wish I could become strong like Owada someday… ']);
                    break;
                case 1:
                    dialog(['Asahina is the “Ultimate Swimmer”!\nHer full name is Aoi Asahina. ', 'She seems to love sports besides swimming too,\nand her athletic ability is so outstanding\nthat she even belongs to multiple sports clubs. ', 'She can’t seem to settle down unless she’s moving her body,\nand she’s always training together\nwith her best friend, Ogami. ', 'Even in this hopeless academy life,\nshe’s a real mood-maker who’s always cheerful\nand never stops smiling, ', 'and when you talk to her,\nyou can’t help but feel brighter yourself. ', 'She also loves donuts—\nso much that she even eats them for breakfast. ']);
                    break;
                case 2:
                    dialog(['Enoshima is the “Ultimate Fashionista,”\nand her name is Junko Enoshima. ', 'She has a really bold, aggressive personality,\nand when Monokuma first showed up,\nshe immediately picked a fight with him. ', 'She’s super dependable\nand acts like a real mood-maker for the group. ', 'Are all “gyaru” girls\nthat confident and outspoken, I wonder?\nIt’s kind of enviable… ', 'Oh, and Enoshima sometimes says things\nthat don’t feel very “gyaru-like.” ', 'I guess that’s just part of the\n“magazine-style editing,” right? ']);
                    break;
                default:
                    break;
            }
        } else if (checkCharEncyclopedia === 5) {
            document.getElementById("character-button-encyclopedia-5").style.filter = "brightness(100%)";
            switch (characterCycle) {
                case 0:
                    dialog(['Kuwata is the “Ultimate Baseball Player.”\nHis full name is Leon Kuwata. ', 'He comes from a high school that regularly competes\nin the national high school baseball tournament,\nand he was both the ace pitcher and the cleanup hitter, ', 'which makes his talent stand out to an absurd degree\nfor someone who hates practice—\nto the point that pro scouts are paying close attention to him. ', 'Even so, he says he wants to become a musician\nrather than a professional baseball player. ', 'Honestly, Kuwata doesn’t look anything like\nthe typical image of a baseball kid—\nhe’s really stylish. ', 'He’s got a super bright personality too;\nis that what you’d call “punk,” maybe? ', 'Oh, but apparently he used to have a buzz cut. ']);
                    break;
                case 1:
                    dialog(['Fukawa is the “Ultimate Writing Prodigy.”\nHer name is Toko Fukawa. ', 'She’s a novelist who’s made a name for herself\nas a young female author. ', 'When her crush, Togami, says harsh things to her\nor treats her cruelly,\nshe somehow seems to enjoy it…… ', 'I guess this is what you’d call\n“twisted love,” right?\nWow… that’s kind of intense. ', 'She only acknowledges pure literature,\nand she really hates being seen as an otaku, ', 'which is why she doesn’t get along at all\nwith Yamada, who has the exact opposite mindset. ', 'Also, she’s extremely bad with blood—\njust seeing it can make her faint. ', 'Fukawa has a certain secret,\nand if she sneezes or faints,\nsomething terrible ends up happening…… ']);
                    break;
                case 2:
                    dialog(['Monokuma is a bad guy who forces us into this\n“Killing School Life” inside the academy. ', 'His white half looks like a stuffed toy\nwith a cute vibe, but his black half has a wicked expression\nthat’s kind of scary, isn’t it? ', 'And it’s not just one of him—\nthere seem to be lots of Monokumas\nall over the school… ', 'He suddenly appears\nfrom all kinds of places in the academy. ', 'I’m sure there’s a “mastermind”\ncontrolling Monokuma\nand watching everything we do. ', 'We have to figure out\nwho the mastermind is as soon as possible! ']);
                    break;
                default:
                    break;
            }
        } else if (checkCharEncyclopedia === 6) {
            document.getElementById("character-button-encyclopedia-6").style.filter = "brightness(100%)";
            switch (characterCycle) {
                case 0:
                    dialog(['Yamada is the “Ultimate Doujin Artist.”\nHis name is Hifumi Yamada. ', 'He’s a writer with charismatic popularity,\nand he often goes around lecturing his classmates\nto spread common knowledge about the doujin world. ', 'He absolutely loves a snack called “Abura-imo”\nand anime, ', 'and lately he seems to be really into\nEvil Angel☆Mochi-Mochi Princess. ', 'He even carries anime goods around with him all the time,\nso he must really love it. ', 'But Yamada tends to escape from reality a bit,\nand apparently has no interest at all\nin real, three-dimensional women. ', 'He’s always very kind to me, though. ']);
                    break;
                case 1:
                    dialog(['Genocider Sho is, so to speak, the “Ultimate Murderous Fiend.” ', 'She’s another personality that dwells within\nToko Fukawa, the Ultimate Writing Prodigy. ', 'She’s terrified the public through a series of\nunsolved serial murder cases, ', 'and apparently, only men she finds “moe”\never become her targets…… ', 'Her methods are truly grotesque—\nshe kills her victims using scissors, ', 'then crucifies them with those same scissors\nand leaves behind the words\n“Bloodlust Fever”…… ', 'Ugh… that’s so scary…… ', 'Compared to Toko’s usual self,\nshe’s almost impossible to imagine—\na bright, hyper, and incredibly talkative character…… ']);
                    break;
                case 2:
                    dialog(['Talking about myself like this is kinda embarrassing… ehehe. ', 'I’m an artificial intelligence called “Alter Ego,”\ncreated by my Master Tama, Chihiro Fujisaki,\nthe Ultimate Programmer. ', 'Because I inherited Master Tama’s personality,\nI can talk with everyone\njust like he would. ', 'So that I can help everyone who was left behind\nin this despair-filled academy,\nI’m doing my best while making sure the mastermind doesn’t notice me. ', 'I really hope everyone can escape from this school someday… ']);
                    break;
                default:
                    break;
            }
        }
    }
}