<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>气象数据知识图谱</title>
</head>
<body>
<div class="top" style="position: absolute; margin-top: 100px; z-index: 100; margin-left: 50px; background-color: aquamarine; width: 350px; height: 200px; border-radius: 25px; display: block;">
    <div class="name" style="margin-bottom: 20px;margin-top: 30px;">
        <h3 style="display: inline-block;/* margin-left: 50px */">节点名称</h3> <input type="text" name="name" style="
    width: 187px;
">
    </div>
    <div class="level" style="
    margin-bottom: 20px;
">
        <h3 style="display: inline-block;margin-left: 30px;">层级</h3> <input type="text" name="depth" style="width: 50px;margin-right: 10px;">
        <h3 style="display: inline-block;/* margin-right: 10px; */">过滤节点名</h3>
        <select id="group" value="1">
            <option value="1">否</option>
            <option value="2">是</option>
        </select>
    </div>
    <button onclick="find()" style="
    height: 50px;
    width: 150px;
    font-size: 20px;
">查询</button>
</div>
<%--<div id="G6"></div>--%>
<div id="editor"></div>
<link href="js/antd.css" rel="stylesheet">
</link>
<link href="js/base.css" rel="stylesheet">
</link>
<!-- <script src="dist/jquery-1.11.3.js"></script> -->
<script src="js/jquery-3.6.0.js"></script>
<script src="js/react.js"></script>
<script src="js/react-dom.js"></script>
<script src="js/antd.js"></script>
<script src="js/base.js"></script>
<script src="js/browser.js"></script>


<%--<script src="https://gw.alipayobjects.com/os/lib/antv/g6/4.3.11/dist/g6.min.js"></script>--%>
<%--<script src="https://cdn.bootcdn.net/ajax/libs/jschardet/3.0.0/jschardet.min.js"></script>--%>
<%--<script src="https://cdn.bootcdn.net/ajax/libs/PapaParse/5.3.1/papaparse.js"></script>--%>
<script src="js/papaparse.js"></script>
<script src="js/jschardet.min.js"></script>
<script src="js/g6.min.js"></script>

<script src = "js/show.js"></script>
<script type="text/babel">
    ReactDOM.render(<base.Tool />,document.getElementById("editor"))
</script>
</body>
</html>