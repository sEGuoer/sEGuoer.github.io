// 获取html标签中的h2 h3的等级
function getLevel(str = '') {
    const result = str.slice(-1);
    return Number(result);
}
// 生成对应的树结构数据
let titleData: any = [];
const tocTags = ['H2', 'H3', 'H4'];
const childrennode = document.getElementsByClassName('ck-editor__editable')[0]?.children;
if (childrennode) {
    const newData = Array.from(childrennode);
    titleData = newData.filter((item) => {
        return tocTags.includes(item.nodeName);
    });
}
console.log(titleData, 'titleData');
const testtreeArray: any = [];
for (let i = 0; i < titleData?.length; i++) {
    const nodeName = titleData[i].nodeName;
    titleData[i].setAttribute('id', `${i}`);
    const reg = /<[^>]+>/gim;
    const name = titleData[i].innerHTML.replace(reg, '');
    const lastname = name.replace(/&nbsp;/gm, ' ');
    if (tocTags.includes(nodeName)) {
        let lastIndex = '';
        if (getLevel(titleData[i].nodeName) < getLevel(titleData[i !== 0 ? i - 1 : 0].nodeName)) {
            //如果当前的等级小于上一级,则为上一级的上级,因此查找最近的同tag等级的pid
            //eg:若当前为h2 上一级为h4那么,则当前应与最近的h2的同级,因此当前等级的pid为最近的h2的pid
            const data1 = testtreeArray.map((el) => el.tag);
            lastIndex = data1.lastIndexOf(titleData[i].nodeName);
        }
        console.log(
            titleData,
            getLevel(titleData[i].nodeName), //2
            titleData[i !== 0 ? i - 1 : 0]?.getAttribute('id'),
        );
        const item = {
            value: titleData[i]?.getAttribute('id'),
            value_text: lastname.trim(),
            tag: titleData[i].nodeName,
            //如果当前的tag等级大于上一级 eg:当前h3上一级为h2 那么当前必然是上一级的子级,同理相等为同级,反之则为上一级的上级
            pid:
                getLevel(titleData[i].nodeName) > getLevel(titleData[i !== 0 ? i - 1 : 0].nodeName)
                    ? titleData[i !== 0 ? i - 1 : 0]?.getAttribute('id')
                    : getLevel(titleData[i].nodeName) ===
                    getLevel(titleData[i !== 0 ? i - 1 : 0].nodeName)
                        ? testtreeArray[i !== 0 ? i - 1 : 0]?.pid
                        :testtreeArray[lastIndex]?.pid,
        };
        console.log(item, 'item');
        testtreeArray.push(item);
    }
}
const treeList = arrayToTree(testtreeArray);
treeArray = treeList;
console.log(treeArray);

// 树结构生成方法
function arrayToTree(data) {
    const treeList: any = [];
    const map: any = {};
    data.forEach((item) => {
        if (!item.children) {
            item.children = [];
        }
        map[item.value] = item;
    });
    data.forEach((item) => {
        const parent = map[item.pid];
        if (parent) {
            parent.children.push(item);
        } else {
            treeList.push(item);
        }
    });
    return treeList;
}
const childrennode = document.getElementsByClassName('ck-editor__editable')[0]?.children;
console.log(childrennode, 'childrennode');

const newData = Array.from(childrennode);
titleData = newData.filter((item) => {
    return tocTags.includes(item.nodeName);
});
const nodeName = titleData[i].nodeName;
titleData[i].setAttribute('id', `${i}`);  //设置id
const reg = /<[^>]+>/gim;
const name = titleData[i].innerHTML.replace(reg, ''); //一些特殊符号处理
const lastname = name.replace(/&nbsp;/gm, ' '); //针对节点的名字存在的空格符做特殊处理
if (tocTags.includes(nodeName)) {
    const pid22 = testtreeArray.filter((item) => {
        if (item.tag == titleData[i].nodeName) {
            return item.pid;
        }
    });
    const item = {
        value: titleData[i]?.getAttribute('id'),
        value_text: lastname.trim(),
        tag: titleData[i].nodeName,
        pid:
            getLevel(titleData[i].nodeName) > getLevel(titleData[i !== 0 ? i - 1 : 0].nodeName)
                ? titleData[i !== 0 ? i - 1 : 0]?.getAttribute('id')
                : getLevel(titleData[i].nodeName) ===
                getLevel(titleData[i !== 0 ? i - 1 : 0].nodeName)
                    ? testtreeArray[i !== 0 ? i - 1 : 0]?.pid
                    : pid22[0]?.pid,
    };
    testtreeArray.push(item);
}
if (item.tag == titleData[i].nodeName) {
    return item.pid;
}
const item = {
    value: titleData[i]?.getAttribute('id'),
    value_text: lastname.trim(),
    tag: titleData[i].nodeName,
    pid:
        getLevel(titleData[i].nodeName) > getLevel(titleData[i !== 0 ? i - 1 : 0].nodeName)
            ? titleData[i !== 0 ? i - 1 : 0]?.getAttribute('id')
            : getLevel(titleData[i].nodeName) ===
            getLevel(titleData[i !== 0 ? i - 1 : 0].nodeName)
                ? testtreeArray[i !== 0 ? i - 1 : 0]?.pid
                : pid22[0]?.pid,
};
function arrayToTree(data) {
    const treeList: any = [];
    const map: any = {};
    data.forEach((item) => {
        if (!item.children) {
            item.children = [];
        }
        map[item.value] = item;
    });
    data.forEach((item) => {
        const parent = map[item.pid];
        if (parent) {
            parent.children.push(item);
        } else {
            treeList.push(item);
        }
    });
    return treeList;
}
import React, { FC } from 'react';
import { Anchor } from 'antd';
const { Link } = Anchor;

type IProps = {
    link: any[];
    offset: number;
};
import React, { FC } from 'react';
import { Anchor } from 'antd';
const { Link } = Anchor;

type IProps = {
    link: any[];
    offset: number;
};
const AnchorSet: FC<IProps> = (props: IProps) => {
    const preventLink = (e) => {
        e.preventDefault();
    };
    const renderBaseTreeNodes = (data) => {
        const result = data?.map((n, i) => {
            if (n.children) {
                return (
                    <Link href={`#${n.value}`} title={n.value_text} key={n.value + n.value_text}>
                        {renderBaseTreeNodes(n.children)}
                    </Link>
                );
            } else {
                return <Link href={`#${n.value}`} title={n.value_text} key={n.value + n.value_text} />;
            }
        });
        return result;
    };
    return (
        <Anchor
            onClick={preventLink}
            getContainer={() => document.getElementById('scroll') as HTMLElement}
            targetOffset={props.offset}
        >
            {renderBaseTreeNodes(props.link)}
        </Anchor>
    );
};
export default AnchorSet;

<AnchorSet link={treeArray} offset={30} />


