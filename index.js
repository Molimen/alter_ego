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
    if (clock_start_check !== true) {
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
    if (clock_back_check !== true) {
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

function encyclopedia() {

}

function encyclopedia_start() {
    if (encyclopedia_start_check !== true) {
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
    if (encyclopedia_back_check !== true) {
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
                break;
            case 2:
                dialog(['It`s a mix of Japanese and Western styles, with all kinds of things here. ', 'There are paper lanterns hanging up,\nand suits of armor, jars, paintings, and other items lined up—\nit gives the place a slightly unusual atmosphere. ', 'Once you collect Monokuma Medals,\nyou can use them in the MonoMono Machine here. ']);
                break
            case 3:
                dialog(['It`s the capsule machine in the school store.\nEach time you use it,\nyou need at least one Monokuma Medal. ', 'When you turn the lever, you can get all kinds of items! ', 'If you use multiple medals at once,\nthe chance of getting duplicate prizes goes down, apparently. ', 'There are 92 different prizes in total,\nincluding some rare ones,\nso why don`t you give it a try? ']);
                break
            case 4:
                dialog(['There are all kinds of books packed tightly onto the shelves.\nThey`re not very well maintained,\nso it`s a bit dusty, but… ', 'If anything,\nit seems like there are a lot of specialized, more difficult books. ', 'Togami is often here reading.\nApparently, the archives are his favorite spot. ', 'And wherever Togami is,\nyou`ll usually find Fukawa nearby too—\nbut is Fukawa here for the books, or for something else…? ']);
                break
            case 5:
                dialog(['The person in charge of taking out the trash\ndisposes of all the collected garbage in the incinerator here. ', 'It`s done on a rotating duty schedule,\nso no slacking off, okay? ', 'The shutter is always closed,\nso only the person on duty who has the key\ncan open it. ', 'To think that even a garbage incinerator like this\nwould end up being connected to an incident… ', 'Oh, right—there`s also a door built into the ground,\nbut that one`s locked too, so it won`t open. ']);
                break
            case 6:
                dialog(['There are lots of washing machines lined up,\njust like a coin laundry. ', 'There are magazines and even a vending machine,\nso you can kill time while you wait. ', 'Apparently, there are sometimes forgotten items\nwith no clear owner, but… ', 'everyone needs to remember\nto take their laundry home with them! ']);
                break
            case 7:
                dialog(['It`s a large pool with six lanes,\nand there are even spectator seats on both sides.\nPretty impressive. ', 'If there were a competition or something,\nthe stands here would probably be completely full. ', 'But despite being such a large, noticeable place,\nit surprisingly doesn`t end up having much to do\nwith the incident. ']);
                break
            case 8:
                dialog(['There are darts, billiards,\nand all kinds of magazines too. ', 'To think they even have facilities like this—\nit`s really luxurious. ', 'They`ve got Othello and shogi as well,\nso anyone can casually enjoy themselves. ', 'I`d like to try playing billiards too. ', 'But since Celeste is here at the academy,\nI kind of feel scared\nto challenge her. Hehe. ']);
                break
            case 9:
                dialog(['The large device in the center of the room\nis an air purifier. ', 'It seems to circulate the air\nthroughout the entire academy. ', 'It`s amazing that they were able to build\nsuch a gigantic air purifier, but… ', 'does the air really get so polluted\nthat they need something this huge? ', 'That`s kind of scary… ']);
                break
            case 10:
                dialog(['Oh right, there are surveillance cameras\nall over the academy,\nbut there aren`t any installed here or in the large bath. ', 'Is Monokuma surprisingly gentlemanly, maybe? ', 'But even without cameras,\nthis must have been a difficult place\nfor Master Tama, having to be mindful of so many things. ']);
                break
            case 11:
                dialog(['Oh right,\nyou can view X-ray images here. ', 'I wonder if there was an Ultimate-level doctor or something? ', 'It looks like there are all kinds of medicines too, but\nhonestly, it`d be best if no one had to use a place like this, ', 'and everyone could just stay healthy above all else… ']);
                break
            case 12:
                dialog(['Of course, there`s a large painting of a mountain\ndisplayed on the wall!\nIt`s a bit disappointing that it`s not Mount Fuji, though… ', 'Besides the huge bath,\nthere`s also a sauna further inside. ', 'I wonder if Master Tama managed to get through the changing room\nand take a bath here properly?\nI`m sure everything turned out fine, right? ']);
                break
            case 13:
                dialog(['There are student desks and chairs, at least,\nbut they`re set up more like audience seating. ', 'And the lighting is incredibly lavish, too… ', 'It`d be fun if Maizono sang here… ', 'After all,\nshe is the “Ultimate Idol”! ']);
                break
            case 14:
                dialog(['Besides the Monokuma statues,\nthere are things like the Venus de Milo and Nio statues here too. ', 'The walls are completely covered with paintings,\ngiving the place a somewhat unsettling atmosphere, but… ', 'there`s also a full set of art supplies and sculpting tools,\nall properly stocked. ', 'I wonder if there was someone here\nknown as the “Ultimate Artist”? ', 'That said, if we leave it alone,\nit might end up turning into\nYamada`s personal figure atelier. ']);
                break
            case 15:
                dialog(['The biology lab is always locked,\nso you can never go inside.\nI wonder what`s in there? ', 'Maybe there are human anatomy models\nor frogs preserved in formalin\nor something like that…? ', 'Hmm… I`m starting to think\nit might be better to just leave it locked… ']);
                break
            case 16:
                dialog(['There were targets used for kyudo, but…\ndid Hope`s Peak Academy have a kyudo club, I wonder? ', 'All the certificates displayed here\nmight belong to the kyudo club too. ', 'If there really was an “Ultimate Archer,”\nI couldn`t help wondering\nwho would be stronger—them or Ogami. ']);
                break
            case 17:
                dialog(['The sprinklers water everything every morning,\nso it seems like the plants don`t need much care. ', 'Even though it`s inside the academy,\nit somehow has a jungle-like\natmosphere to it… ']);
                break
            case 18:
                dialog(['There are tons of cooking utensils here,\nlike pots and frying pans. ', 'This place is probably the reason\nAsahina`s stomach gets kept satisfied, but… ', 'having so many blades around\nkind of makes me feel uneasy… ']);
                break
            case 19:
                dialog(['Basically, everyone gathers here every day\nto think about how we can escape\nthis hopeless academy life, ', 'or to calm ourselves down with some tea. ', 'It`s what you`d call a place to relax! ', 'That`s why I think\nit`s an important place within this academy. ']);
                break
            case 20:
                dialog(['It`s the peaceful time\nwhen no incidents are happening. ', 'During this time,\nwe deepen our bonds with one another. ', 'Even if a tragic incident\nis waiting for us afterward… ']);
                break
            case 21:
                dialog(['They call it an “execution” using a nicer-sounding term, but… ', 'depending on the outcome of the class trial vote,\neither the blackened, or everyone except the blackened, ', 'will be subjected to an extremely cruel punishment\ncarried out by Monokuma. ', 'Because of this,\nclass trials always become trials fought with our lives on the line… ']);
                break
            case 22:
                dialog(['It refers to someone who killed their friends\nbecause they wanted to graduate from the academy. ', 'But not every blackened chose\nto dirty their hands willingly. ', 'They were all driven to it\nby the “motives” presented by Monokuma. ', 'In a way,\nthe blackened are victims too…\nvictims of Monokuma… ']);
                break
            case 23:
                dialog(['It`s a currently popular anime\nthat Yamada is a huge fan of. ', 'The main character is a slightly chubby girl\ncalled Princess Piggles, ', 'and it`s getting an anime adaptation and is apparently very popular.\nYamada keeps recommending it to me nonstop. ', 'But I don`t think this is really the time for that right now… ']);
                break
            case 24:
                dialog(['These are the school rules decided by Monokuma, the “headmaster,”\nand they include rules you`d never see at a normal school. ', 'You can check them on the electronic student handbook,\nand Monokuma adds to them whenever he feels like it. ', 'It seems that if you break them, you`ll be punished,\nso everyone has to be careful. ']);
                break
            case 25:
                dialog(['It`s a message written in blood\nleft at the scene where the victim was killed by “Genocider Sho.” ', 'The message was written using the victim`s own blood,\nand it also serves as proof\nthat they were murdered by “Genocider Sho”… ', 'It`s scary… it`s way too scary… ']);
                break
            case 26:
                dialog(['If the “blackened” who committed the murder\nmanages to be judged innocent through the class trial vote, ', 'that blackened is allowed to escape from the school. ', 'Escaping even if it means killing everyone else\nis something no normal person would consider,\nbut Monokuma deliberately incites that kind of thinking… ']);
                break
            case 27:
                dialog(['It`s an electronic tool given to us by Monokuma.\nWhen you turn it on, it displays the owner`s real name. ', 'It also functions as a key card, ', 'and Monokuma said it`s\n“a very sturdy tool that won`t break easily,\ncan`t be hacked or modified,” ', 'but… when someone says something is impossible,\nit kind of makes you want to try it, doesn`t it—\n“hacking,” I mean. ']);
                break
            case 28:
                dialog(['It`s a mercenary group from the Middle East,\nunlike typical military contractors, ', 'it was a terrifying organization that acted as a direct combat force\nand wreaked havoc in various regions. ', 'But at some point, it suddenly ceased all activity, ', 'so rumors spread about internal collapse\nor a complete massacre to silence everyone involved… ', 'It`s probably an organization\nthat has nothing to do with high school students like us, though… ']);
                break
            case 29:
                dialog(['It`s the time period from 10:00 p.m. to 7:00 a.m.\nwhen entering certain facilities, like the dining hall,\nis prohibited. ', 'According to Monokuma,\nit`s basically his way of saying,\n“Go to bed early and wake up early!” ', 'It`s a strangely strict, almost orderly rule… ']);
                break
            case 30:
                dialog(['It`s an incident that supposedly occurred a year ago,\nbut no details are known at all. ', 'I`m actually in the middle of gathering information about it right now. ', 'There seem to be traces of it left\nall over the academy, ', 'and just imagining how horrific it must have been\nis enough to make me scared… ']);
                break
            case 31:
                dialog(['After a murder occurs\nand the investigation of the incident is finished,\na class trial is held. ', 'Everyone clashes their opinions and deductions,\nwith the goal of uncovering the truth of the crime\nand exposing the blackened. ', 'At the end of the trial,\nthere`s a vote on “who the blackened is”… ']);
                break
            case 32:
                dialog(['It`s an autopsy report created by Monokuma\nbased on footage from the surveillance cameras. ', 'In other words, Monokuma is always witnessing the crime. ', 'He never gets his own hands dirty,\nand instead tries to make us kill each other.\nHow cruel can that be… ']);
                break
            case 33:
                dialog(['Originally, this was a place the academy`s students used as a space to learn, but ', 'now it`s nothing more than one stage\nof this hopeless academy life. ', 'There`s graffiti on the blackboards in each classroom—\nI wonder who wrote it? ']);
                break
            case 34:
                dialog(['It`s a general term for students\nwho possess talents that stand out far above those of other high schoolers their age. ', 'All the students gathered at Hope`s Peak Academy\nare these so-called “Ultimates,” ', 'and being an Ultimate\nis both the minimum and the greatest requirement\nfor enrolling in the academy. ']);
                break
            case 35:
                dialog(['It`s the name of a massive biker gang\nthat controls the Kanto region,\nwith Owada serving as its leader. ', 'I personally have nothing to do\nwith that kind of delinquent world, but… ', 'I can`t help admiring\nOwada`s manliness. Hehe. ']);
                break
            default:
                break;
        }
    }
}