import re

text_content_raw = []
trigger = False

with open("text.txt", "r") as f:
    for line in f:
        if line[0] == "#":
            trigger = True
            text_content = []
            temp = ""
            for line in text_content_raw:
                skip = False
                for i in range(len(line)):
                    if line[i] == "<" and line[i+1:i+6] == "DSTOP" and line[i+6] == ">":
                        skip = True
                        break

                if not skip:
                    temp += line
                else:
                    temp += line
                    temp = re.sub(r"<DSTOP>\s*", "", temp)
                    text_content.append(temp)
                    temp = ""


            print(text_content)
            print("")
            text_content_raw = []
        else:
            text_content_raw.append(line)

text_content = []
temp = ""
for line in text_content_raw:
    skip = False
    for i in range(len(line)):
        if line[i] == "<" and line[i+1:i+6] == "DSTOP" and line[i+6] == ">":
            skip = True
            break

    if not skip:
        temp += line
    else:
        temp += line
        temp = re.sub(r"<DSTOP>\s*", "", temp)
        text_content.append(temp)
        temp = ""


print(text_content)
print("")
text_content_raw = []