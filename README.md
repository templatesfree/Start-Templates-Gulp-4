<h1>Сборка проекта на GULP 4</h1>


<p>Современная Frontend разработка предполагает использование препроцессора стилей SCSS или LESS, препроцессора, сжатие изображение, JS и CSS файлов, в целях оптимизации загрузки веб-страниц и многое другое.</p>

<p>Чтобы упросить этот процесс, мы используем универсальную сборкой проектов на Gulp 4. </p>


<h3>Установка:</h3>
<ul>
    <li>для запуска рабочего проекта необходимо установить модули npm через команду: <b>npm install</b></li>
    <li>После установки вам нужно прописать вот такую команду: <b>npm run gulp</b></li>
</ul>

Проект готов к работе

<h3>Рекомендации по использованию:</h3>
Работа с папками производится в папке <b>GULP</b>.
Все что внутри нее будет собираться и отправляться в папку local

<b>fonts</b> - папка куда мы складываем шрифты с расширениями woff и woff2

<b>images</b> - папка с изображениями

<b>js</b> - папка где мы добавляем общие для всего сайта скрипты

<b>page_mobile</b> - папка где мы добавляем стили для мобильной версии, структура должна быть такой же как и для десктопа.

Если вы будите использовать нижнее подчеркивание перед именем стилевого файла: _slider.scss. То обязательно импортируйте его в главный стилевой файл home.scss

Так же добавляем и js файлы в папку page_desctop/home/home.js

<b>styles</b> - папка где мы собираем общие файлы стилей для всего сайта, как с папкой js

<h3>Подключение сторонних библиотек</h3>

Для установки плагина используем команду <b>npm</b>
Все сторонние библиотеки устанавливаются в папку <b>node_modules</b>
Подключаем плагины к тем страницам в которых этот плагин должен работать, импортируем плагин с помощью Rigger например: 

//= ../../node_modules/bootstrap/dist/js/bootstrap.min.js, точки ставим в зависимости от вашей вложенности, ../ - шаг вверх, ../../ - два шага вверх

<h3>Работа с изображениями</h3>
Изображения разделены на папки для jpg, png, svg

Когда вы закидываете в папку какое то изображение, оно автоматически конвертируется в формат webp

Для изображений мы используем LazyLoading

Так же используем тег picture:

```
	<!--[if IE 9]><video style="display: none"><![endif]-->
	<source
		data-srcset="500.jpg"
		media="(max-width: 500px)" />
	<source
			data-srcset="1024.jpg"
			media="(max-width: 1024px)" />
	<source
			data-srcset="1200.jpg" />
<!--[if IE 9]></video><![endif]-->
<img
		src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
		data-src="1024.jpg"
		class="lazyload"
		alt="image with artdirection" />
</picture>'

```