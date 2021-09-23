BEGIN

FOR c IN (SELECT table_name FROM user_tables) LOOP
EXECUTE IMMEDIATE ('DROP TABLE "' || c.table_name || '" CASCADE CONSTRAINTS');
END LOOP;

FOR s IN (SELECT sequence_name FROM user_sequences) LOOP
EXECUTE IMMEDIATE ('DROP SEQUENCE ' || s.sequence_name);
END LOOP;

FOR v IN (SELECT view_name FROM user_views) LOOP
EXECUTE IMMEDIATE ('DROP VIEW ' || v.view_name);
END LOOP;

END;
/
--
--essential (Already filled and updated after each semester)
--offered_branch (Static only taken CS, ME)
--seat_matrix_branch (Seat matrix of CS,ME)
--course(All the courses offered)
--pre_req(All prerequiste courses)
--instructor
--seat_matrix_breadth
--course_allocated (CR_id,instr_id,sem,branch)
--breadth_allocated(Only for breadth separtaly)
--student (All student)
--admission (New admission)
--registration (Next sem registration detail, flushed after each semester)
--attendance (FLushed after each semester)
--grade_report (Have all data, never flushed)
--backlog (Have all data,deleetd when student clear backlog)
--graduation (When student passes all semester withput backlog)
--temp_student(Used in the go next sem button by table minus)
--temp_instructor(Used in go next sem button by table minus)
-- prefernece(Breadth preference)
-- instructor_course
--sgpa_list
--cgpa_list view

--essential (Already filled and updated after each semester)
--offered_branch (Static only taken CS, ME)
--seat_matrix_branch (Seat matrix of CS,ME)
--course(All the courses offered)
--pre_req(All prerequiste courses)
--instructor
--seat_matrix_breadth
--course_allocated (CR_id,instr_id,sem,branch)
--breadth_allocated(Only for breadth separtaly)
--student (All student)
--admission (New admission)
--registration (Next sem registration detail, flushed after each semester)
--attendance (Flushed after each semester)
--grade_report (Have all data, never flushed)
--backlog (Have all data,deleetd when student clear backlog)
--graduation (When student passes all semester withput backlog)
--temp_student(Used in the go next sem button by table minus)
--temp_instructor(Used in go next sem button by table minus)
-- prefernece(Breadth preference)
-- instructor_course
--sgpa_list
--cgpa_list view

--essential
create table essential(
	even_odd number,
	year number,
	is_admission_done number
);
insert into essential values(1,2018,0);

--offered_branch
create table offered_branch(
	branch varchar(5) primary key
);
insert all
into offered_branch values('CS')
into offered_branch values('ME')
select * from dual;

--seat_matrix_branch
create table seat_matrix_branch(
	branch varchar(5) primary key,
	no_seat number
);
--insertion
insert all
into seat_matrix_branch values('CS',5)
into seat_matrix_branch values('ME',5)
into seat_matrix_branch values('HS',5)
select * from dual;

--course (you can also make a trigger to insert in sequence)
create table course(
	course_id varchar(10) primary key,
	course_name varchar(30),
	type char,
	credit number,
	books varchar(100)
);
-- Make code compatible for nw insertion using a trigger with Cs_Seq and ME_seq

--HS
insert all
into course values('HS1','Basix Mathematics','T',4,'ABC')
into course values('HS6','Philosphy','B',3,'ABC')
into course values('HS7','Economics','B',3,'ABC')
select * from dual;

--CS
insert all
into course values('CS3','Discrete Mathematics','T',4,'ABC')
into course values('CS4','Digital Electronics','T',4,'ABC')
into course values('CS7','Compiler Design','T',4,'ABC')
select * from dual;

--ME
insert all
into course values('ME1','Mechanics','T',4,'ABC')
into course values('ME3','Industrial Theory','T',4,'ABC')
into course values('ME4','Thermodynamics','T',4,'ABC')
into course values('ME7','Fluid Mechanics','T',4,'ABC')
select * from dual;

--pre_req
create table pre_req(
	course_id varchar(10) references course(course_id),
	pre_course_id varchar(10) references course(course_id)
);
-- insertion
insert all
into pre_req values('CS3','HS1')
into pre_req values('CS7','CS4')
into pre_req values('ME4','ME3')
into pre_req values('ME7','ME1')
select * from dual;

--Create a view for this pre_req
create or replace view course_view as select C.course_id,P.pre_course_id  from course C left outer join pre_req P on C.course_id=P.course_id;

--seat_matrix_course
create table seat_matrix_course(
	course_id varchar(10) references course(course_id),
	no_seat number
);
--insertion
insert all
into seat_matrix_course values('HS6',6)
into seat_matrix_course values('HS7',6)
select * from dual;

create table instructor(
	instructor_id number primary key,
	instructor_name varchar(30),
	branch varchar(5),
	specialisation varchar(50),
	email varchar(50),
	password varchar(50)
);
create sequence instructor_number
Start with 17
Increment by 1;

--insertion
insert all
into instructor values(1,'Ram Gopal','CS','ABC','ramgopal@iitbbs.ac.in','orcl')
into instructor values(2,'Hari Dash','CS','ABC','haridash@iitbbs.ac.in','orcl')
into instructor values(3,'Moham Gopal','CS','ABC','mohamgopal@iitbbs.ac.in','orcl')
into instructor values(4,'Hamuna Bihari','ME','ABC','hamunabihari@iitbbs.ac.in','orcl')
into instructor values(5,'Chandra Mukesh','ME','ABC','chandramukhesh@iitbbs.ac.in','orcl')
into instructor values(6,'Hari Shankar','ME','ABC','harishankar@iitbbs.ac.in','orcl')
into instructor values(7,'Sohail Khan','HS','ABC','sohailkhan@iitbbs.ac.in','orcl')
into instructor values(8,'Preetam Jha','HS','ABC','preetamjha@iitbbs.ac.in','orcl')
into instructor values(9,'Shmriti Jha','HS','ABC','shmritijha@iitbbs.ac.in','orcl')
into instructor values(10,'Rajakumar Verma','CS','ABC','rvraja@iitbbs.ac.in','orcl')
select * from dual;

--institute
create table institute(
	instructor_id number references instructor(instructor_id)
);
insert into institute values(10);

--course_allocated
create table course_allocated(
	course_id varchar(10) references course(course_id),
	instructor_id number references instructor(instructor_id),
	sem number,
	branch varchar(20)
);

--CS
--insertion
insert all
into course_allocated values('CS3',3,2,'CS')
into course_allocated values('CS4',1,3,'CS')
into course_allocated values('CS7',1,4,'CS')
select * from dual;

--ME
insert all
into course_allocated values('ME1',4,2,'ME')
into course_allocated values('ME3',6,2,'ME')
into course_allocated values('ME4',4,3,'ME')
into course_allocated values('ME7',4,4,'ME')
select * from dual;

--common
insert all
into course_allocated values('HS1',7,1,'CS')
into course_allocated values('HS1',7,1,'ME')
select * from dual;

--breadth_allocated
create table breadth_allocated(
	course_id varchar(10) references course(course_id),
	instructor_id number references instructor(instructor_id),
	sem number,
	branch varchar(5)
);
insert all
into breadth_allocated values('HS6',8,3,'CS')
into breadth_allocated values('HS6',8,3,'ME')
into breadth_allocated values('HS7',7,3,'CS')
into breadth_allocated values('HS7',7,3,'ME')
select * from dual;

--instructor_course
create or replace view instructor_course_view as select * from course_allocated union select * from breadth_allocated;

create or replace view instructor_distinct_view as select distinct course_id,instructor_id,sem from course_allocated union select distinct course_id,instructor_id,sem from breadth_allocated;
--course_alloted view
create or replace view course_allocated_view as select C.course_id,C.pre_course_id,sem,branch from course_view C left outer join course_allocated I on C.course_id=I.course_id;

--all_course_allocated_view
create or replace view all_course_allocated_view as select C.course_id,sem from course_view C left outer join instructor_distinct_view I on C.course_id=I.course_id;


--Creation of table Student
create table student(
	student_name varchar(30),
	branch varchar(5) references seat_matrix_branch(branch),
	roll varchar(20) primary key,
	address varchar(50),
	cur_sem number,
	password varchar(20)
);
--CS
insert all
into student values('Saswat Dash','CS','2018CS1','Sailashree Vihar, Bhubaneswar, Odisha, 759146',1,'orcl')
into student values('Bhargav Kulkarni','CS','2018CS2','Pune, Maharastra,756123', 1,'orcl')
select * from dual;

--ME
--ME
insert all
into student values('Surangi','ME','2018ME1','Sailashree Vihar, Bhubaneswar, Odisha, 759146',1,'orcl')
into student values('Bimalendu','ME','2018ME2','Pune, Maharastra,756123', 1,'orcl')
select * from dual;

--admission
create table admission(
	student_name varchar(30),
	branch varchar(5) references offered_branch(branch),
	address varchar(50),
	password varchar(20)
);

--registration (only for current semester then the table is flushed)
create table registration(
	course_id varchar(10) references course(course_id),
	roll varchar(20) references student(roll),
	sem number,
	primary key(course_id,roll)
);
insert all
into registration values('HS1','2018CS1',1)
into registration values('HS1','2018CS2',1)
into registration values('HS1','2018ME1',1)
into registration values('HS1','2018ME2',1)
select * from dual;

--view
create or replace view instructor_registration_view as  select course_id,roll,Instructor_id,sem,cur_sem from (select * from registration natural join instructor_distinct_view) natural join student order by course_id;

--backlog
create table backlog(
	course_id varchar(10) references course(course_id),
	roll varchar(20) references student(roll),
	year number,
	even_odd number
);

create or replace view fail_breadth_view as select distinct roll from student natural join backlog where mod(cur_sem,2)=0 and course_id in (select distinct course_id from course where type='B');

create or replace view preference_registration_view as (select distinct roll from registration natural join student where cur_sem=2);
--attendance
create table attendance(
	course_id varchar(10) references course(course_id),
	roll varchar(20) references student(roll),
	--instructor_id number references instructor(instructor_id),
	att number,
	tot number
);

--grade_report
create table temp_grade_report(
	course_id varchar(10) references course(course_id),
	roll varchar(20) references student(roll),
	grade number
);
create table grade_report(
	course_id varchar(10) references course(course_id),
	roll varchar(20) references student(roll),
	sem number,
	year number,
	even_odd number,
	grade number
);


--graduation
create table graduation(
	roll varchar(20) references student(roll),
	student_name varchar(30),
	year number
);

--temp_student
create table temp_student(
	roll varchar(20) references student(roll)
);

--temp_instructor
create table temp_instructor(
	instructor_id number references instructor(instructor_id),
	status char,
	primary key(instructor_id,status)
);

-- prefernece
create table preference(
	course_id varchar(10),
	roll varchar(20),
	pref_no number
);
create or replace trigger pr_1
before insert on preference
for each row
declare
a number;
begin
	select count(*) into a from breadth_allocated where course_id=:new.course_id;
	if(a=0) then
		RAISE_APPLICATION_ERROR('-20125', 'Wrong Breadth : Enter a valid breadth HS5,HS6,HS7');
	end if;
end;
/
--cgpa_list
create or replace view course_credit as select course_id,credit from course;

create or replace view sgpa_list as
select roll,sem, round((sum(grade*credit))/(sum(credit)),2) as SGPA from grade_report natural join course_credit group by roll,sem order by roll,sem;
create or replace view cgpa_list as
select roll, round(sum(SGPA)/count(*),2) as CGPA from sgpa_list group by roll order by roll;

--credits
-- table is for looking at the credits
create table semester_credit(
	sem number,
	branch varchar(5) references offered_branch(branch),
	no_credit number,
	primary key(sem,branch)
);

--insertion
insert all
into semester_credit values(1,'CS',16)
into semester_credit values(1,'ME',16)
into semester_credit values(2,'CS',16)
into semester_credit values(2,'ME',16)
into semester_credit values(3,'CS',18)
into semester_credit values(3,'ME',18)
into semester_credit values(4,'CS',18)
into semester_credit values(4,'ME',18)
select * from dual;

--deregistration
--degistration table
create table deregistration(
	student_name varchar(30),
	branch varchar(5) references seat_matrix_branch(branch),
	roll varchar(20),
	address varchar(50),
	cur_sem number,
	password varchar(20),
	year_dereg number
);

--Additional views
create or replace view preference_display as select * from preference natural join CGPA_list order by CGPA desc,roll,pref_no;

create or replace view breadth_registration_display as
select * from registration where course_id in (select distinct course_id from breadth_allocated) order by roll;

create or replace view registration_view as select course_id,roll,sem,credit from registration natural join course;

--Triggers
--adm_1
create or replace trigger adm_1
after insert on admission
for each row
declare
a number;
b number;
yr number;
begin
	select count(*) into b from student where branch=:new.branch and cur_sem=0;
	select no_seat into a from seat_matrix_branch where branch=:new.branch;
	select year into yr from essential;
	if(b>=a)	then
		RAISE_APPLICATION_ERROR('-20124', 'Admission denied : The number of seat is full');
	else
		insert into student values(:new.student_name,:new.branch,(yr+1) || :new.branch || (b+1),:new.address,0,:new.password);
	end if;
end;
/
--
--
--att_1
--Drop this trigger


--temp_gr_1
create or replace trigger temp_gr_1
after insert on temp_grade_report
for each row
declare
a number;
yr number;
s number;
begin
	select even_odd,year into a,yr from essential;
	select sem into s from all_course_allocated_view where course_id=:new.course_id;
	insert into grade_report values(:new.course_id,:new.roll,s,yr,a,:new.grade);
end;
/

--function to activate_Admission
create or replace function activate_admission return number as
a number;
begin
	select even_odd into a from essential;
	if(a=0) then
		return 1;
	else
		return 0;
	end if;
end;
/
--
----when addmission complete is pressed
create or replace procedure adm_done as
begin
	update essential
	set is_admission_done=1;
	--commit;
end;
/

--when go_next_sem button is pressed
create or replace function activate_go_next_sem return number as
a number;
b number;
c number;
d number;
e number;
ev_od number;
is_adm number;
begin
	select distinct count(*) into a from preference_registration_view;
	select distinct count(distinct roll) into b from preference;
	select distinct count(*) into c from attendance;
	select distinct count(*) into d from temp_grade_report;
	select count(*) into e from instructor_registration_view;
	select even_odd,is_admission_done into ev_od,is_adm from essential;
	dbms_output.put_line(a||','||b||','||c||','||d||','||e||','||ev_od||','||is_adm);
	if(ev_od=1 or (ev_od =0 and  is_adm=1)) then
		if(a=b and c=d and d=e) then
			delete from admission;
			update essential set is_admission_done=0;
			--commit;
			return 1;
		else
			return 0;
		end if;
	else
		return 0;
	end if;
end;
/
--
--IMPLEMENTATION
--deletion in backlog
create or replace procedure del_backlog as
	CR grade_report.course_id%type;
	R grade_report.roll%type;
	cursor c1 is select course_id,roll from temp_grade_report T natural join attendance A where T.grade>4 and (A.att*100)/A.tot >= 75;
begin
	open c1;
	loop
		fetch c1 into CR,R;
		exit when c1%notfound;
		delete from backlog where course_id=CR and roll=R;
	end loop;
	close c1;
end;
/
--
-- populating backlog
create or replace procedure populate_backlog as
	CR grade_report.course_id%type;
	R grade_report.roll%type;
	cursor c1 is select course_id,roll from temp_grade_report T natural join attendance A where T.grade<=4 or (A.att*100)/A.tot < 75;
	ev_od number;
	yr number;
	e number;
begin
	select even_odd, year into ev_od,yr from essential;
	open c1;
	loop
		fetch c1 into CR,R;
		exit when c1%notfound;
		select count(*) into e from grade_report G where G.course_id=CR and G.roll=R and grade<=4;
		insert into backlog values(CR,R,yr,ev_od);
	end loop;
	close c1;
end;
/
--
--
-- allocation of normal core subject
create or replace procedure allocate_subject as
	CR course.course_id%type;
	R student.roll%type;
	S number;
	PCR course.course_id%type;
	a number;
	cursor c1 is select course_id,roll,sem,pre_course_id from student S,course_allocated_view C where S.cur_sem=C.sem and S.branch=C.branch;
begin
	open c1;
	loop
		fetch c1 into CR,R,S,PCR;
		exit when c1%notfound;
		select count(*) into a from backlog B where B.course_id=PCR and B.roll=R;
		if(a=0) then
			insert into registration values(CR,R,S);
			--commit;
		end if;
	end loop;
	close c1;
end;
/
--
-- breadth-allocation through preferntial sorting of CGPA
create or replace procedure preference_allocation as
	a number;
	b number;
	e number;
	R student.roll%type;
	CR course.course_id%type;
	Pn number;
	CG number(5,2);
	flag number;
	R1 student.roll%type;
	cursor c1 is select roll, course_id,pref_no,CGPA from preference natural join cgpa_list order by CGPA desc,pref_no ASC,roll ASC;
begin
	open c1;
	fetch c1 into R,CR,Pn,CG;
	loop
		exit when c1%notfound;
		R1:=R;
		flag:=0;
		loop
			select no_seat into a from seat_matrix_course where course_id=CR;
			select count(*) into b from registration R where R.course_id= CR;
			select count(*) into e from registration R where R.roll=R and course_id in(select distinct course_id from breadth_allocated);
			if(b<a and flag=0 and e=0 ) then
				flag:=1;
				insert into registration values(CR,R,3);
				--commit;
			end if;
			fetch c1 into R,CR,Pn,CG;
			exit when R<>R1;
			exit when c1%notfound;
		end loop;
	end loop;
	close c1;
end;
/
--

-- allocate-backlog
create or replace procedure allocate_backlog as
	ev_od number;
	R student.roll%type;
	CR course.course_id%type;
	S number;
	C_S number;
	B student.branch%type;
	tot_credit number;
	cur_credit number;
	cred number;
	p number;
	cursor c1 is select course_id,roll,sem,cur_sem,branch from (select distinct course_id,roll from backlog) B natural join all_course_allocated_view natural join student;
begin
	select even_odd into ev_od from essential;
	open c1;
	loop
		fetch c1 into CR,R,S,C_S,B;
		exit when c1%notfound;
		if(mod(S,2)=ev_od) then
			if(C_S > 4) then
				tot_credit := 18;
			else
				select no_credit into tot_credit from semester_credit where sem=C_S and branch=B;
			end if;
			select nvl(sum(credit), 0) into cur_credit from registration_view where roll=R;
			select credit into cred from course where course_id=CR;
			if(cred+cur_credit<=tot_credit) then
				insert into registration values(CR,R,S);
			end if;
		end if;
	end loop;
	close c1;
end;
/


--populate-graduation
create or replace procedure populate_graduation as
	N student.student_name%type;
	R student.roll%type;
	yr number;
	cursor c1 is select student_name,roll from student where roll not in (select distinct roll from backlog union select distinct roll from graduation union select distinct roll from deregistration) and cur_sem>=5;
begin
	select year into yr from essential;
	open c1;
	loop
		fetch c1 into N,R;
		exit when c1%notfound;
		insert into graduation values(R,N,yr);
	end loop;
	close c1;
end;
/

--allocate-registration
create or replace procedure allocate_registration as
ev_od number;
a number;
begin
	select even_odd into ev_od from essential;
	delete from registration;
	if(ev_od = 0) then
		update essential set year=year+1;
	end if;
	update essential set even_odd=mod(even_odd+1,2);
	update student set cur_sem=cur_sem+1;
	--commit;
	allocate_subject;
	select count(*) into a from preference;
	if(a>0) then
		preference_allocation;
	end if;
	allocate_backlog;
	populate_graduation;
end;
/
--
-- procedure for deregistration
create or replace procedure de_reg as
	N student.student_name%type;
	B student.branch%type;
	R student.roll%type;
	A student.address%type;
	C_S student.cur_sem%type;
	P student.password%type;
	yr number;
	cursor c1 is select student_name,branch,roll,address,cur_sem,password from student natural join (select distinct(roll) from backlog group by roll,course_id having count(*)>=3);
begin
open c1;
select year into yr from essential;
loop
	fetch c1 into N,B,R,A,C_S,P;
	exit when c1%notfound;
	--delete the student data from backlog and student table
	delete from backlog where roll=R;
	-- delete from student where roll=R;
	insert into deregistration values(N,B,R,A,C_S,P,yr);
end loop;
close c1;
end;
/

create or replace procedure flush_table as
begin
	delete from attendance;
	delete from temp_grade_report;
	delete from preference;
	--commit;
end;
/
--
--change_next_sem
create or replace procedure change_next_sem as
begin
	del_backlog;
	populate_backlog;
	de_reg;
	allocate_registration;
	flush_table;
end;
/
